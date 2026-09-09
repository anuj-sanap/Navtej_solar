import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const projectInput = z.object({
  title: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(80),
  capacity: z.string().trim().min(1).max(40),
  description: z.string().trim().min(5).max(2000),
  imagePath: z.string().trim().min(1).max(300),
});

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("projects").select("id, title, location, category, capacity, description, image_url").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Projects are not available right now." }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.SUPABASE_ADMIN_EMAIL?.toLowerCase();
  if (!user || user.email?.toLowerCase() !== adminEmail) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = projectInput.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please complete all project fields." }, { status: 400 });

  const { imagePath, ...project } = parsed.data;
  const { data, error } = await supabase.from("projects").insert({ ...project, image_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${imagePath}`, created_by: user.id }).select().single();
  if (error) return NextResponse.json({ error: "Could not save the project." }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}