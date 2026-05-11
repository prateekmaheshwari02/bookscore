type SheetEventPayload = Record<string, unknown> & {
  eventType: "quiz_started" | "feedback_submitted";
};

export async function sendSheetEvent(payload: SheetEventPayload) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString()
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
  } catch (error) {
    console.error("Google Sheets event failed:", error);
  }
}
