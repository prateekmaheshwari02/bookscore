import { NextResponse } from "next/server";
import { createDemoQuiz, hasUsableOpenAiKey } from "@/lib/demo";
import { OPENAI_MODEL, openai, parseJsonResponse } from "@/lib/openai";
import { sendSheetEvent } from "@/lib/sheets";
import type { QuizQuestion } from "@/lib/types";

type GenerateQuizBody = {
  userName?: string;
  bookName?: string;
};

function validateQuestions(questions: QuizQuestion[]) {
  return questions.length === 10 && questions.every((item) => {
    return (
      typeof item.question === "string" &&
      Array.isArray(item.options) &&
      item.options.length === 4 &&
      typeof item.correctAnswer === "string" &&
      item.options.includes(item.correctAnswer) &&
      typeof item.concept === "string"
    );
  });
}

export async function POST(request: Request) {
  let fallbackUserName = "Reader";
  let fallbackBookName = "this book";

  try {
    const body = (await request.json()) as GenerateQuizBody;
    const userName = body.userName?.trim();
    const bookName = body.bookName?.trim();
    fallbackUserName = userName || fallbackUserName;
    fallbackBookName = bookName || fallbackBookName;

    if (!userName || !bookName) {
      return NextResponse.json({ error: "User name and book name are required." }, { status: 400 });
    }

    const sessionId = crypto.randomUUID();

    if (!hasUsableOpenAiKey()) {
      await sendSheetEvent({
        eventType: "quiz_started",
        sessionId,
        userName,
        bookName,
        mode: "demo"
      });

      return NextResponse.json({
        sessionId,
        userName,
        bookName,
        questions: createDemoQuiz(bookName),
        demoMode: true
      });
    }

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You create rigorous non-fiction reading comprehension quizzes. Test the reader's grasp of the author's advice, point of view, arguments, mental models, and conceptual applications. Avoid trivia, publication facts, author biography, and obscure details."
        },
        {
          role: "user",
          content: `Create a 10-question multiple-choice quiz for the book "${bookName}".

Return JSON with this exact shape:
{
  "questions": [
    {
      "question": "A conceptual question framed around the author's advice or point of view",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact matching correct option",
      "concept": "The concept being tested",
      "chapterHint": "Best-known chapter, section, or topic area to revisit; use Topic: ... if chapter is uncertain"
    }
  ]
}

Rules:
- Make questions moderately difficult.
- Require understanding and application, not memorized facts.
- Prefer question frames like:
  - "Which of the following best represents the author's point of view on ...?"
  - "Which action would the author most likely advise in this situation?"
  - "Which interpretation would the author disagree with most strongly?"
  - "Which example best applies the author's argument about ...?"
- Each question must test what the author is arguing, advising, or warning against.
- Make every option plausible.
- Ensure correctAnswer exactly matches one option string.`
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "OpenAI returned an empty quiz response." }, { status: 502 });
    }

    const parsed = parseJsonResponse<{ questions: QuizQuestion[] }>(content);

    if (!validateQuestions(parsed.questions)) {
      return NextResponse.json({ error: "OpenAI returned an invalid quiz format." }, { status: 502 });
    }

    await sendSheetEvent({
      eventType: "quiz_started",
      sessionId,
      userName,
      bookName,
      mode: "ai"
    });

    return NextResponse.json({
      sessionId,
      userName,
      bookName,
      questions: parsed.questions
    });
  } catch (error) {
    console.error("Quiz generation failed:", error);
    if (isOpenAiQuotaError(error)) {
      const sessionId = crypto.randomUUID();
      await sendSheetEvent({
        eventType: "quiz_started",
        sessionId,
        userName: fallbackUserName,
        bookName: fallbackBookName,
        mode: "fallback"
      });

      return NextResponse.json({
        sessionId,
        userName: fallbackUserName,
        bookName: fallbackBookName,
        questions: createDemoQuiz(fallbackBookName),
        demoMode: true,
        warning: "OpenAI quota is unavailable, so BookScore used Demo Mode."
      });
    }

    return NextResponse.json({ error: "Failed to generate quiz." }, { status: 500 });
  }
}

function isOpenAiQuotaError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const possibleError = error as { status?: number; code?: string; type?: string };
  return possibleError.status === 429 || possibleError.code === "insufficient_quota" || possibleError.type === "insufficient_quota";
}
