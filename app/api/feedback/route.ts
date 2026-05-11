import { NextResponse } from "next/server";
import { sendSheetEvent } from "@/lib/sheets";

type FeedbackBody = {
  sessionId?: string;
  userName?: string;
  bookName?: string;
  score?: number;
  rating?: number;
  comment?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FeedbackBody;
    const rating = Number(body.rating);

    if (!body.sessionId || !body.userName || !body.bookName || !Number.isFinite(rating) || rating < 1 || rating > 10) {
      return NextResponse.json({ error: "Session, user, book, and a rating from 1 to 10 are required." }, { status: 400 });
    }

    await sendSheetEvent({
      eventType: "feedback_submitted",
      sessionId: body.sessionId,
      userName: body.userName,
      bookName: body.bookName,
      score: typeof body.score === "number" ? body.score : null,
      rating,
      comment: body.comment?.trim() || ""
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Feedback submission failed:", error);
    return NextResponse.json({ error: "Failed to submit feedback." }, { status: 500 });
  }
}
