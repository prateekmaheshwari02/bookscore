import { NextResponse } from "next/server";
import { hasUsableOpenAiKey } from "@/lib/demo";

export async function GET() {
  return NextResponse.json({
    aiEnabled: hasUsableOpenAiKey()
  });
}
