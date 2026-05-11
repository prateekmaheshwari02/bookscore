type SheetEventPayload = Record<string, unknown> & {
  eventType: "quiz_started" | "feedback_submitted";
};

export async function sendSheetEvent(payload: SheetEventPayload) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return { ok: false, configured: false, error: "GOOGLE_SHEETS_WEBHOOK_URL is not configured." };
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString()
      }),
      signal: controller.signal
    });

    const text = await response.text();
    return {
      ok: response.ok,
      configured: true,
      status: response.status,
      responseText: text.slice(0, 300)
    };
  } catch (error) {
    console.error("Google Sheets event failed:", error);
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Unknown Google Sheets webhook error."
    };
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}
