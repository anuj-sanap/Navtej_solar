import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDatabase } from "@/lib/db";
import { Lead } from "@/lib/models/Lead";
import { calculateSolar } from "@/lib/calculator/calculate";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

const leadInput = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  phone: z.string().trim().min(10, "Valid phone number is required").max(25),
  email: z.string().trim().email().optional().or(z.literal("")),
  location: z.string().trim().min(2, "Location is required").max(100),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  contactMethod: z.enum(["phone", "whatsapp", "email"]).optional(),
  systemSizeKw: z.coerce.number().int().min(1).max(20).optional(),
  calculatorResult: z.any().optional(),
  plotSize: z.coerce.number().positive().optional(),
  electricityBill: z.coerce.number().positive().optional(),
  source: z.string().optional(),
});

const localLeads: Array<Record<string, unknown>> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadInput.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.message ?? "Please check the form fields.";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const {
      name,
      phone,
      email,
      location,
      message,
      contactMethod,
      systemSizeKw,
      calculatorResult,
      plotSize,
      electricityBill,
      source = "website",
    } = parsed.data;

    const requestedSize = systemSizeKw ?? calculatorResult?.systemSizeKw;
    const calcData = requestedSize ? calculateSolar(requestedSize) : calculatorResult;

    const leadRecord = {
      name,
      phone,
      email: email || undefined,
      location,
      message: message || "Interested in a solar consultation and quotation.",
      contactMethod: contactMethod || "whatsapp",
      systemSizeKw: requestedSize,
      calculatorData: calcData,
      plotSize,
      electricityBill,
      source,
      status: "new",
      createdAt: new Date(),
    };

    const database = await connectDatabase();
    if (database) {
      await Lead.create(leadRecord);
    } else {
      localLeads.push(leadRecord);
    }

    // Build direct WhatsApp message for the owner
    const ownerPhone = (
      process.env.NEXT_PUBLIC_OWNER_WHATSAPP ||
      process.env.OWNER_PHONE ||
      "919403277273"
    ).replace(/[^0-9]/g, "");

    const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

    let whatsappText = `☀️ *NEW SOLAR QUOTE ENQUIRY*\n`;
    whatsappText += `━━━━━━━━━━━━━━━━━━━━━\n`;
    whatsappText += `👤 *Customer Name:* ${name}\n`;
    whatsappText += `📞 *Phone:* ${phone}\n`;
    whatsappText += `📍 *Location:* ${location}\n`;
    if (email) whatsappText += `📧 *Email:* ${email}\n`;
    if (plotSize) whatsappText += `🏠 *Plot/Roof Size:* ${plotSize} sq ft\n`;
    if (electricityBill) whatsappText += `⚡ *Monthly Bill:* ₹${electricityBill}\n`;
    if (requestedSize) whatsappText += `🔆 *Requested System:* ${requestedSize} kW\n`;
    if (calcData?.estimatedCostInr) {
      whatsappText += `💰 *Est. Cost:* ${inr.format(calcData.estimatedCostInr)}\n`;
      whatsappText += `💵 *Est. Annual Savings:* ${inr.format(calcData.annualSavingInr)}\n`;
      whatsappText += `⏱️ *Payback:* ${calcData.paybackYears} yrs\n`;
    }
    whatsappText += `📲 *Contact Preference:* ${contactMethod || "WhatsApp"}\n`;
    if (message) whatsappText += `💬 *Note:* ${message}\n`;
    whatsappText += `━━━━━━━━━━━━━━━━━━━━━\n`;
    whatsappText += `_Navtej Solartech Energy System Lead_`;

    // Dispatch directly to owner WhatsApp via server
    const dispatchResult = await sendWhatsAppNotification(whatsappText, ownerPhone);

    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(whatsappText)}`;

    return NextResponse.json(
      {
        ok: true,
        whatsappUrl,
        ownerPhone,
        dispatchResult,
        message: "Your enquiry has been received and sent directly to Navtej Solartech on WhatsApp.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ error: "We could not save your enquiry right now." }, { status: 500 });
  }
}
