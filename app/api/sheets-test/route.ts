import { NextResponse } from "next/server";
import { sendSheetEvent } from "@/lib/sheets";

export async function GET() {
  const sheetResult = await sendSheetEvent({
    eventType: "feedback_submitted",
    sessionId: "manual-test",
    userName: "Sheet Test",
    bookName: "BookScore Setup",
    score: "",
    rating: 10,
    comment: "Testing Google Sheets webhook from BookScore.",
    mode: "test"
  });

  return NextResponse.json(sheetResult, { status: sheetResult.ok ? 200 : 502 });
}
