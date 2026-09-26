/**
 * Direct WhatsApp Notification Service
 * Sends automated WhatsApp notifications directly to the owner without requiring
 * the customer to send a message from their own personal WhatsApp account.
 *
 * Supported providers:
 * 1. CallMeBot API (Free, instant personal WhatsApp alerts)
 * 2. Twilio WhatsApp API
 * 3. Meta WhatsApp Cloud API (Graph API)
 * 4. Custom Webhook (e.g. Zapier, Make, Wati, UltraMsg, GreenAPI)
 * 5. Console / Internal Dispatch fallback
 */

export interface WhatsAppNotificationResult {
  success: boolean;
  provider: string;
  deliveredTo: string;
  error?: string;
}

export async function sendWhatsAppNotification(
  message: string,
  targetPhone?: string
): Promise<WhatsAppNotificationResult> {
  const rawPhone = targetPhone || process.env.NEXT_PUBLIC_OWNER_WHATSAPP || process.env.OWNER_PHONE || "919403277273";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");

  // 1. Try CallMeBot if API key is configured (Free, instant personal WhatsApp alerts)
  const callMeBotKey = process.env.CALLMEBOT_API_KEY;
  if (callMeBotKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=+${cleanPhone}&text=${encodeURIComponent(
        message
      )}&apikey=${callMeBotKey}`;
      const res = await fetch(url, { method: "GET" });
      if (res.ok) {
        console.log(`[WhatsApp] Sent successfully via CallMeBot to +${cleanPhone}`);
        return { success: true, provider: "callmebot", deliveredTo: cleanPhone };
      }
      const errText = await res.text();
      console.warn(`[WhatsApp] CallMeBot error:`, errText);
    } catch (err) {
      console.error(`[WhatsApp] CallMeBot fetch failed:`, err);
    }
  }

  // 2. Try Twilio if configured
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER;
  if (twilioSid && twilioToken && twilioFrom) {
    try {
      const fromNumber = twilioFrom.startsWith("whatsapp:") ? twilioFrom : `whatsapp:${twilioFrom}`;
      const toNumber = `whatsapp:+${cleanPhone}`;
      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");

      const body = new URLSearchParams({
        From: fromNumber,
        To: toNumber,
        Body: message,
      });

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (res.ok) {
        console.log(`[WhatsApp] Sent successfully via Twilio to +${cleanPhone}`);
        return { success: true, provider: "twilio", deliveredTo: cleanPhone };
      }
      const errJson = await res.json();
      console.warn(`[WhatsApp] Twilio error:`, errJson);
    } catch (err) {
      console.error(`[WhatsApp] Twilio fetch failed:`, err);
    }
  }

  // 3. Try Meta WhatsApp Cloud API if configured
  const metaToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (metaToken && metaPhoneId) {
    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/${metaPhoneId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${metaToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: cleanPhone,
          type: "text",
          text: { body: message },
        }),
      });

      if (res.ok) {
        console.log(`[WhatsApp] Sent successfully via Meta Cloud API to +${cleanPhone}`);
        return { success: true, provider: "meta_cloud_api", deliveredTo: cleanPhone };
      }
      const errJson = await res.json();
      console.warn(`[WhatsApp] Meta Cloud API error:`, errJson);
    } catch (err) {
      console.error(`[WhatsApp] Meta Cloud API failed:`, err);
    }
  }

  // 4. Try UltraMsg (Scan WhatsApp QR code) if configured
  const ultramsgInstance = process.env.ULTRAMSG_INSTANCE_ID?.trim();
  const ultramsgToken = process.env.ULTRAMSG_TOKEN?.trim();
  if (ultramsgInstance && ultramsgToken) {
    try {
      const url = `https://api.ultramsg.com/${ultramsgInstance}/messages/chat`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          token: ultramsgToken,
          to: cleanPhone,
          body: message,
        }).toString(),
      });
      if (res.ok) {
        console.log(`[WhatsApp] Sent successfully via UltraMsg to +${cleanPhone}`);
        return { success: true, provider: "ultramsg", deliveredTo: cleanPhone };
      }
      const errJson = await res.json();
      console.warn(`[WhatsApp] UltraMsg error:`, errJson);
    } catch (err) {
      console.error(`[WhatsApp] UltraMsg failed:`, err);
    }
  }

  // 5. Try Generic Webhook (e.g., Zapier, Make, Wati, GreenAPI)
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: cleanPhone,
          message,
          timestamp: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        console.log(`[WhatsApp] Sent successfully via Webhook to +${cleanPhone}`);
        return { success: true, provider: "webhook", deliveredTo: cleanPhone };
      }
    } catch (err) {
      console.error(`[WhatsApp] Webhook failed:`, err);
    }
  }

  // 5. Try Telegram Bot if configured (100% Free, Official, Instant and Never Blocked)
  const tgToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const tgChatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (tgToken && tgChatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });
      if (res.ok) {
        console.log(`[Telegram] Notification sent successfully to chat ${tgChatId}`);
        return { success: true, provider: "telegram", deliveredTo: `telegram:${tgChatId}` };
      }
      const errJson = await res.json();
      console.warn(`[Telegram] Telegram error:`, errJson);
    } catch (err) {
      console.error(`[Telegram] Failed to send:`, err);
    }
  }

  // 6. Default Fallback: Server Log & internal dispatch
  console.log(`\n======================================================`);
  console.log(`📱 [DIRECT NOTIFICATION DISPATCH TO OWNER: +${cleanPhone}]`);
  console.log(`Time: ${new Date().toLocaleString("en-IN")}`);
  console.log(`------------------------------------------------------`);
  console.log(message);
  console.log(`======================================================\n`);

  return {
    success: true,
    provider: "server_dispatch",
    deliveredTo: cleanPhone,
  };
}
