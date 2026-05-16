import { NextResponse } from "next/server";
import { sendSheetEvent } from "@/lib/sheets";

type TrackVisitBody = {
  visitorId?: string;
  path?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TrackVisitBody;
    const visitorId = body.visitorId?.trim();

    if (!visitorId) {
      return NextResponse.json({ error: "visitorId is required." }, { status: 400 });
    }

    await sendSheetEvent({
      eventType: "visitor_seen",
      sessionId: visitorId,
      userName: "",
      bookName: body.path || "/",
      score: "",
      rating: "",
      comment: "Unique visitor",
      mode: "visitor"
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Visitor tracking failed:", error);
    return NextResponse.json({ ok: true });
  }
}
