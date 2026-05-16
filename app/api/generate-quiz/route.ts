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
            "You are BookScore, an AI designed to measure how well a person has understood a non-fiction book, not merely whether they have read it. Create clear, thoughtful MCQs that are engaging, moderately challenging, and occasionally lightly witty without becoming silly."
        },
        {
          role: "user",
          content: `The user is ${userName}. The non-fiction book is "${bookName}".

Generate exactly 10 highly intelligent multiple-choice questions based on the core ideas, arguments, frameworks, mental models, and nuances of that book.

The questions should:
- Test depth of understanding, not trivial facts
- Focus on concepts, reasoning, implications, examples, contradictions, and applications
- Avoid page numbers, dates, chapter counts, publication details, or obscure names unless absolutely central
- Include some questions that require connecting multiple ideas from the book
- Include a few scenario-based questions where the user must apply the book's ideas in real-life situations
- Be understandable to a thoughtful general reader
- Be moderately difficult, not academic or painfully complex
- Differentiate between surface readers and careful readers without making the user feel punished
- Add a little fun or gentle humor where natural, especially in scenarios or wrong options, but never make the correct answer obvious

Question distribution:
- 4 conceptual understanding questions
- 3 application/situation-based questions
- 2 nuanced or counterintuitive insight questions
- 1 core thesis question

Return JSON with this exact shape:
{
  "questions": [
    {
      "question": "Question text only. Do not include the answer.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact matching correct option",
      "concept": "The concept being tested",
      "chapterHint": "Best-known chapter, section, or topic area to revisit; use Topic: ... if chapter is uncertain"
    }
  ]
}

Rules:
- Each question must have exactly 4 options.
- Only 1 option should be clearly correct.
- Wrong options should be plausible, not silly.
- Do not reveal correct answers in the question text or option labels.
- Keep the tone smart, friendly, and lightly playful.
- Use plain English and avoid dense abstract wording.
- Avoid long, tangled questions. If a question is scenario-based, keep the scenario short.
- Avoid repetition.
- Questions should feel like they were created by someone who understands the book and respects the reader's time.
- Each question must test what the author is arguing, advising, implying, complicating, or warning against.
- Do not repeatedly mention the author's name. Use the author's name in at most 2 questions.
- Prefer natural phrasing such as "the book's argument," "the central claim," "this framework," "the author would most likely argue," or "which interpretation best fits the book?"
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
