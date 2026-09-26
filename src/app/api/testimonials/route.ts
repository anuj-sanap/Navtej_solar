import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDatabase } from "@/lib/db";
import { Testimonial } from "@/lib/models/Testimonial";
import { getAuthUserFromRequest, isOwnerUser } from "@/lib/auth";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

const testimonialCreateSchema = z.object({
  name: z.string().trim().min(1, "Customer name is required").max(100),
  quote: z.string().trim().min(1, "Feedback or review is required").max(2000),
  location: z.string().trim().max(100).optional().default(""),
  rating: z.coerce.number().min(1).max(5).optional().default(5),
  serviceType: z.string().trim().max(100).optional().default("Offline Solar Installation"),
});

const defaultTestimonials = [
  {
    id: "default-1",
    quote: "The team made subsidy paperwork simple and the installation was finished exactly when promised.",
    name: "Prasad Kulkarni",
    location: "Nashik Road",
    rating: 5,
    serviceType: "Rooftop Solar Installation (Offline)",
    source: "customer",
  },
  {
    id: "default-2",
    quote: "Our monthly bill dropped dramatically. Navtej gave us clear advice without pushing a bigger system than we needed.",
    name: "Meenal Patil",
    location: "Gangapur Road",
    rating: 5,
    serviceType: "Offline Solar Service",
    source: "customer",
  },
  {
    id: "default-3",
    quote: "Professional from the site visit to handover. The monitoring support has been excellent.",
    name: "Rohan Deshmukh",
    location: "Indira Nagar",
    rating: 5,
    serviceType: "Commercial Solar Project",
    source: "customer",
  },
];

export async function GET() {
  try {
    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json(defaultTestimonials);
    }

    const items = await Testimonial.find().sort({ createdAt: -1 }).lean();
    if (!items || items.length === 0) {
      return NextResponse.json(defaultTestimonials);
    }

    const formatted = items.map((t) => ({
      id: t._id.toString(),
      _id: t._id.toString(),
      name: t.name,
      quote: t.quote,
      location: t.location || "",
      rating: t.rating || 5,
      serviceType: t.serviceType || "Offline Solar Installation",
      source: t.source || "customer",
      createdAt: t.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json(defaultTestimonials);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUserFromRequest(request);
    const body = await request.json().catch(() => ({}));
    const parsed = testimonialCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid testimonial data." },
        { status: 400 }
      );
    }

    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database not connected." }, { status: 503 });
    }

    const isOwner = isOwnerUser(user);
    const source = isOwner ? "admin" : "customer";

    const created = await Testimonial.create({
      name: parsed.data.name,
      quote: parsed.data.quote,
      location: parsed.data.location || "",
      rating: parsed.data.rating || 5,
      serviceType: parsed.data.serviceType || "Offline Solar Installation",
      source,
      createdBy: user ? user.userId : undefined,
    });

    // Notify owner about customer review
    const stars = "★".repeat(created.rating || 5);
    const notificationText = `⭐ New Customer Rating Received!\nCustomer: ${created.name}\nRating: ${stars} (${created.rating}/5)\nService: ${created.serviceType}\nLocation: ${created.location || "Nashik"}\nFeedback: "${created.quote}"`;
    sendWhatsAppNotification(notificationText).catch(() => {});

    return NextResponse.json(
      {
        id: created._id.toString(),
        _id: created._id.toString(),
        name: created.name,
        quote: created.quote,
        location: created.location,
        rating: created.rating,
        serviceType: created.serviceType,
        source: created.source,
        createdAt: created.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json({ error: "Could not save testimonial." }, { status: 500 });
  }
}
