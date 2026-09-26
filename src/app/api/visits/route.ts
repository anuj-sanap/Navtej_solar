import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { Visit } from "@/lib/models/Visit";
import { getAuthUserFromRequest, isOwnerUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user || !isOwnerUser(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const visits = await Visit.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json(visits);
  } catch (error) {
    console.error("GET /api/visits error:", error);
    return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 });
  }
}
