import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { Testimonial } from "@/lib/models/Testimonial";
import { getAuthUserFromRequest, isOwnerUser } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    if (!isOwnerUser(user)) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    if (!id || id.startsWith("default-") || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: "Cannot delete default seed review or invalid ID." }, { status: 400 });
    }
    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database not connected." }, { status: 503 });
    }

    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      message: "Testimonial deleted successfully.",
      id,
    });
  } catch (error) {
    console.error("DELETE /api/testimonials/[id] error:", error);
    return NextResponse.json({ error: "Could not delete testimonial." }, { status: 500 });
  }
}
