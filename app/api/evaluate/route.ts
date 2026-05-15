import { NextResponse } from "next/server";
import { createDemoEvaluation, hasUsableOpenAiKey } from "@/lib/demo";
import { OPENAI_MODEL, openai, parseJsonResponse } from "@/lib/openai";
import type { AnswerReview, EvaluationResult, UserAnswer } from "@/lib/types";

type EvaluateBody = {
  userName?: string;
  bookName?: string;
  answers?: UserAnswer[];
};

function rawScore(answers: UserAnswer[]) {
  const correct = answers.filter((answer) => answer.selectedAnswer === answer.correctAnswer).length;
  return Math.round((correct / answers.length) * 100);
}

function validateResult(result: EvaluationResult) {
  return (
    typeof result.score === "number" &&
    typeof result.percentage === "number" &&
    Array.isArray(result.strengths) &&
    Array.isArray(result.weakConcepts) &&
    typeof result.feedback === "string" &&
    Array.isArray(result.rereadSuggestions) &&
    Array.isArray(result.chapterSuggestions) &&
    Array.isArray(result.answerReviews)
  );
}

function normalizeStringList(items: unknown): string[] {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    if (typeof item === "string") return item;
    if (typeof item === "number") return String(item);

    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const chapter = record.chapter || record.chapterHint || record.section || record.topic || "Suggested reread";
      const reason = record.reason || record.explanation || record.why;

      if (typeof reason === "string") {
        return `${String(chapter)}: ${reason}`;
      }

      return Object.entries(record)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join("; ");
    }

    return String(item);
  });
}

function normalizeAnswerReviews(items: unknown, answers: UserAnswer[]): AnswerReview[] {
  if (!Array.isArray(items)) {
    return buildFallbackAnswerReviews(answers);
  }

  const reviews = items.map((item, index) => {
    const answer = answers[index];

    if (!item || typeof item !== "object") {
      return buildFallbackAnswerReview(answer);
    }

    const record = item as Record<string, unknown>;
    const question = typeof record.question === "string" ? record.question : answer?.question || "";
    const selectedAnswer = typeof record.selectedAnswer === "string" ? record.selectedAnswer : answer?.selectedAnswer || "";
    const correctAnswer = typeof record.correctAnswer === "string" ? record.correctAnswer : answer?.correctAnswer || "";
    const isCorrect = typeof record.isCorrect === "boolean" ? record.isCorrect : selectedAnswer === correctAnswer;
    const explanation = typeof record.explanation === "string" ? record.explanation : buildFallbackAnswerReview(answer).explanation;

    return {
      question,
      selectedAnswer,
      correctAnswer,
      isCorrect,
      explanation
    };
  });

  return reviews.length ? reviews : buildFallbackAnswerReviews(answers);
}

function buildFallbackAnswerReviews(answers: UserAnswer[]) {
  return answers.map(buildFallbackAnswerReview);
}

function buildFallbackAnswerReview(answer?: UserAnswer): AnswerReview {
  if (!answer) {
    return {
      question: "",
      selectedAnswer: "",
      correctAnswer: "",
      isCorrect: false,
      explanation: "Review unavailable for this answer."
    };
  }

  const isCorrect = answer.selectedAnswer === answer.correctAnswer;

  return {
    question: answer.question,
    selectedAnswer: answer.selectedAnswer,
    correctAnswer: answer.correctAnswer,
    isCorrect,
    explanation: isCorrect
      ? "Correct. Your answer matches the author's conceptual point."
      : `This answer misses the concept of ${answer.concept}. The correct answer better reflects the author's argument or advice.`
  };
}

export async function POST(request: Request) {
  let fallbackBookName = "this book";
  let fallbackAnswers: UserAnswer[] = [];

  try {
    const body = (await request.json()) as EvaluateBody;
    const userName = body.userName?.trim();
    const bookName = body.bookName?.trim();
    const answers = body.answers ?? [];
    fallbackBookName = bookName || fallbackBookName;
    fallbackAnswers = answers;

    if (!userName || !bookName || answers.length !== 10) {
      return NextResponse.json({ error: "User name, book name, and 10 answers are required." }, { status: 400 });
    }

    const deterministicScore = rawScore(answers);

    if (!hasUsableOpenAiKey()) {
      return NextResponse.json({
        ...createDemoEvaluation(bookName, answers),
        demoMode: true
      });
    }

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.45,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You evaluate conceptual understanding of non-fiction books. Be specific, helpful, and honest. Suggest chapters only when you are confident they exist in the book; otherwise suggest named sections, topics, or ideas to revisit."
        },
        {
          role: "user",
          content: `Evaluate ${userName}'s quiz for "${bookName}".

The score must be exactly ${deterministicScore} out of 100, based on correct answers.

Answers:
${JSON.stringify(answers, null, 2)}

Return JSON with this exact shape:
{
  "score": ${deterministicScore},
  "percentage": ${deterministicScore},
  "strengths": ["Specific concepts the user handled well"],
  "weakConcepts": ["Specific concepts the user struggled with"],
  "feedback": "Personalized explanation of what the user misunderstood and how to improve.",
  "rereadSuggestions": ["Specific topics or ideas to revisit"],
  "chapterSuggestions": ["Chapter or section reread recommendations, each with a short reason"],
  "answerReviews": [
    {
      "question": "Original question text",
      "selectedAnswer": "The user's selected answer",
      "correctAnswer": "The correct answer",
      "isCorrect": false,
      "explanation": "Explain why the selected answer is wrong and why the correct answer is right. If the user's answer is correct, explain briefly why it is right."
    }
  ]
}

Focus on conceptual gaps, not trivia. Explain wrong answers in plain language.
Return one answerReviews item for every answer, in the same order as the answers array.
For each wrong answer, clearly state:
- why the selected answer is wrong
- what the correct answer is
- why the correct answer better reflects the author's point of view

For chapterSuggestions:
- Use chapterHint values from the answers when they are helpful.
- If the book's chapter names are widely known, name the chapter.
- If you are not sure of exact chapter names or numbers, write "Topic/section: ..." instead of inventing a chapter.
- Tie each chapter or section suggestion to the weak concepts shown by the user's answers.`
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "OpenAI returned an empty evaluation response." }, { status: 502 });
    }

    const parsed = parseJsonResponse<EvaluationResult>(content);
    const result = {
      ...parsed,
      score: deterministicScore,
      percentage: deterministicScore,
      strengths: normalizeStringList(parsed.strengths),
      weakConcepts: normalizeStringList(parsed.weakConcepts),
      rereadSuggestions: normalizeStringList(parsed.rereadSuggestions),
      chapterSuggestions: normalizeStringList(parsed.chapterSuggestions),
      answerReviews: normalizeAnswerReviews(parsed.answerReviews, answers)
    };

    if (!validateResult(result)) {
      return NextResponse.json({ error: "OpenAI returned an invalid evaluation format." }, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Quiz evaluation failed:", error);
    if (isOpenAiQuotaError(error) && fallbackAnswers.length) {
      return NextResponse.json({
        ...createDemoEvaluation(fallbackBookName, fallbackAnswers),
        demoMode: true,
        warning: "OpenAI quota is unavailable, so BookScore used Demo Mode."
      });
    }

    return NextResponse.json({ error: "Failed to evaluate quiz." }, { status: 500 });
  }
}

function isOpenAiQuotaError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const possibleError = error as { status?: number; code?: string; type?: string };
  return possibleError.status === 429 || possibleError.code === "insufficient_quota" || possibleError.type === "insufficient_quota";
}
