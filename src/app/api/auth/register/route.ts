import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { signAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.message ?? "Invalid form fields.";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const { name, email, password, phone, address } = parsed.data;
    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database service unavailable. Please try again later." }, { status: 503 });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const adminEmail = (process.env.ADMIN_EMAIL || "sanapanuj7@gmail.com").toLowerCase();
    const role = normalizedEmail === adminEmail ? "owner" : "user";

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      address,
      passwordHash,
      role,
    });

    const token = await signAuthToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    });

    const response = NextResponse.json(
      {
        ok: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },
      },
      { status: 201 }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Could not create your account. Please try again." }, { status: 500 });
  }
}
