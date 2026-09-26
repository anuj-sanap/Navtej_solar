import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
let callmebotKey = process.env.CALLMEBOT_API_KEY;
let phone = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "919403277273";
let tgToken = process.env.TELEGRAM_BOT_TOKEN;
let tgChatId = process.env.TELEGRAM_CHAT_ID;
let ultramsgId = process.env.ULTRAMSG_INSTANCE_ID;
let ultramsgToken = process.env.ULTRAMSG_TOKEN;

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("CALLMEBOT_API_KEY=")) {
      callmebotKey = trimmed.split("=")[1]?.trim();
    }
    if (trimmed.startsWith("NEXT_PUBLIC_OWNER_WHATSAPP=")) {
      phone = trimmed.split("=")[1]?.trim();
    }
    if (trimmed.startsWith("TELEGRAM_BOT_TOKEN=")) {
      tgToken = trimmed.split("=")[1]?.trim();
    }
    if (trimmed.startsWith("TELEGRAM_CHAT_ID=")) {
      tgChatId = trimmed.split("=")[1]?.trim();
    }
    if (trimmed.startsWith("ULTRAMSG_INSTANCE_ID=")) {
      ultramsgId = trimmed.split("=")[1]?.trim();
    }
    if (trimmed.startsWith("ULTRAMSG_TOKEN=")) {
      ultramsgToken = trimmed.split("=")[1]?.trim();
    }
  }
}

const cleanPhone = phone.replace(/[^0-9]/g, "");
const testMsg = `☀️ *Navtej Solartech Energy*\n━━━━━━━━━━━━━━━━━━━━━\n✅ *Notification System Active!*\nCustomer quotes and visitor alerts will be delivered here instantly.\n━━━━━━━━━━━━━━━━━━━━━\n_Test dispatched at ${new Date().toLocaleTimeString("en-IN")}_`;

if (ultramsgId && ultramsgToken) {
  console.log(`\n⏳ Sending test WhatsApp message via UltraMsg to +${cleanPhone}...`);
  fetch(`https://api.ultramsg.com/${ultramsgId}/messages/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token: ultramsgToken, to: cleanPhone, body: testMsg }).toString(),
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok && data.sent === "true") {
        console.log("🎉 SUCCESS! Check your WhatsApp on +91 " + cleanPhone.slice(-10) + " — test alert received!\n");
      } else {
        console.log("⚠️ UltraMsg error:", data);
      }
    })
    .catch((err) => console.error("❌ UltraMsg failed:", err.message));
} else if (tgToken && tgChatId) {
  console.log(`\n⏳ Sending test Telegram notification to chat ${tgChatId}...`);
  fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: tgChatId, text: testMsg, parse_mode: "Markdown" }),
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok && data.ok) {
        console.log("🎉 SUCCESS! Check your Telegram app — test alert received!\n");
      } else {
        console.log("⚠️ Telegram error:", data.description);
      }
    })
    .catch((err) => console.error("❌ Telegram failed:", err.message));
} else if (callmebotKey) {
  console.log(`\n⏳ Sending test WhatsApp message to +${cleanPhone}...`);
  const url = `https://api.callmebot.com/whatsapp.php?phone=+${cleanPhone}&text=${encodeURIComponent(
    testMsg
  )}&apikey=${callmebotKey}`;

  fetch(url)
    .then(async (res) => {
      const body = await res.text();
      if (res.ok) {
        console.log("\n🎉 SUCCESS! Check your WhatsApp on +91 " + cleanPhone.slice(-10) + ".");
      } else {
        console.log("\n⚠️ CallMeBot returned error:", body);
      }
    })
    .catch((err) => console.error("\n❌ Request failed:", err.message));
}
