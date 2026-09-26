import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { Visit } from "@/lib/models/Visit";
import { getAuthUserFromRequest } from "@/lib/auth";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

// In-memory throttling cache to notify owner at most once every 20 minutes per visitor session
const recentVisitorAlerts = new Map<string, number>();
const ALERT_THROTTLE_MS = 20 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { path = "/", referrer = "", visitorId = "" } = body;

    // Retrieve authenticated user details if signed in
    const authUser = await getAuthUserFromRequest(request);

    // Extract network information
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // 1. Record in MongoDB
    const db = await connectDatabase();
    if (db) {
      await Visit.create({
        visitorId: visitorId || undefined,
        userId: authUser ? authUser.userId : undefined,
        userName: authUser ? authUser.name : "Guest Visitor",
        userEmail: authUser ? authUser.email : undefined,
        userPhone: authUser ? authUser.phone : undefined,
        userRole: authUser ? authUser.role : "visitor",
        ip,
        userAgent,
        path,
        referrer,
      });
    }

    // 2. Check throttle key
    const throttleKey = authUser ? `user_${authUser.userId}` : `visitor_${visitorId || ip}`;
    const lastAlert = recentVisitorAlerts.get(throttleKey) || 0;
    const now = Date.now();

    // Trigger WhatsApp notification for new visit session
    if (now - lastAlert > ALERT_THROTTLE_MS) {
      recentVisitorAlerts.set(throttleKey, now);

      let visitorMsg = `🔔 *NEW WEBSITE VISITOR ALERT*\n`;
      visitorMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      if (authUser) {
        visitorMsg += `👤 *User:* ${authUser.name}\n`;
        visitorMsg += `📧 *Email:* ${authUser.email}\n`;
        if (authUser.phone) visitorMsg += `📞 *Phone:* ${authUser.phone}\n`;
        visitorMsg += `🏷️ *Role:* ${authUser.role}\n`;
      } else {
        visitorMsg += `👤 *Visitor:* Guest Visitor\n`;
        visitorMsg += `🌐 *IP Address:* ${ip}\n`;
      }
      visitorMsg += `📄 *Page Visited:* ${path}\n`;
      if (referrer) visitorMsg += `🔗 *Referrer:* ${referrer}\n`;
      visitorMsg += `⏰ *Time:* ${new Date().toLocaleString("en-IN")}\n`;
      visitorMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      visitorMsg += `_Navtej Solartech Website Activity_`;

      const ownerPhone = (
        process.env.NEXT_PUBLIC_OWNER_WHATSAPP ||
        process.env.OWNER_PHONE ||
        "919403277273"
      ).replace(/[^0-9]/g, "");

      // Send automated notification directly to owner WhatsApp
      await sendWhatsAppNotification(visitorMsg, ownerPhone);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("track-visit error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
