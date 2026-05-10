import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

export function parseJsonResponse<T>(content: string): T {
  const trimmed = content.trim();
  const json = trimmed.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "");

  return JSON.parse(json) as T;
}
