import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDatabase } from "@/lib/db";
import { Lead } from "@/lib/models/Lead";

const leadInput = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+() -]{10,20}$/),
  email: z.string().trim().email().optional().or(z.literal("")),
  location: z.string().trim().min(2).max(100),
  message: z.string().trim().min(5).max(2000),
  plotSize: z.coerce.number().positive().optional(),
  electricityBill: z.coerce.number().positive().optional(),
});

const localLeads: Array<Record<string, unknown>> = [];

export async function POST(request: Request) {
  try {
    const parsed = leadInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
    const lead = { ...parsed.data, source: "website", status: "new", createdAt: new Date() };
    const database = await connectDatabase();
    if (database) await Lead.create(lead);
    else localLeads.push(lead);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not save your enquiry right now." }, { status: 500 });
  }
}
