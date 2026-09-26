import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { signAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.message ?? "Invalid login credentials.";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database service unavailable. Please try again later." }, { status: 503 });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Auto-upgrade role to owner if email matches configured admin email
    const adminEmail = (process.env.ADMIN_EMAIL || "sanapanuj7@gmail.com").toLowerCase();
    if (normalizedEmail === adminEmail && user.role !== "owner") {
      user.role = "owner";
      await user.save();
    }

    const token = await signAuthToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });

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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Unable to log in. Please try again." }, { status: 500 });
  }
}
