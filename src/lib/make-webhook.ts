const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/2q69i4g6sayev537okftbp6ib41p8gkh";

export interface MakeLeadPayload {
  name: string;
  phone: string;
  email?: string;
  message: string;
  page: string;
  timestamp: string;
}

/**
 * Fire-and-forget POST to Make.com webhook.
 * Never throws — failures are silently swallowed so the main form
 * submission is never blocked by a webhook outage.
 */
export async function sendToMakeWebhook(payload: MakeLeadPayload): Promise<void> {
  try {
    await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // intentionally swallowed
  }
}

