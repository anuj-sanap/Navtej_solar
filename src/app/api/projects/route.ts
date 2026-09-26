import { NextResponse } from "next/server";
import { z } from "zod";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { connectDatabase } from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { getAuthUserFromRequest, isOwnerUser } from "@/lib/auth";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file
const MAX_IMAGE_COUNT = 10;

const projectCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  location: z.string().trim().min(1, "Location is required").max(100),
  category: z.string().trim().max(80).optional().default("Residential"),
  capacity: z.string().trim().max(50).optional().default(""),
  description: z.string().trim().max(3000).optional().default(""),
});

export async function GET() {
  try {
    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    const formatted = projects.map((p) => {
      const images = (p.images && p.images.length > 0) ? p.images : (p.imageUrl ? [p.imageUrl] : []);
      const primaryImage = p.imageUrl || images[0] || "";
      return {
        id: p._id.toString(),
        _id: p._id.toString(),
        title: p.title,
        location: p.location,
        category: p.category || "Residential",
        capacity: p.capacity || "",
        description: p.description || "",
        imageUrl: primaryImage,
        image_url: primaryImage,
        images,
        createdAt: p.createdAt,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Projects are not available right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    if (!isOwnerUser(user)) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const contentType = request.headers.get("content-type") || "";
    let title = "";
    let location = "";
    let category = "Residential";
    let capacity = "";
    let description = "";
    const uploadedImages: string[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = String(formData.get("title") ?? "").trim();
      location = String(formData.get("location") ?? "").trim();
      category = String(formData.get("category") ?? "Residential").trim() || "Residential";
      capacity = String(formData.get("capacity") ?? "").trim();
      description = String(formData.get("description") ?? "").trim();

      // Collect all image files
      const files: File[] = [];
      const imageEntries = [...formData.getAll("images"), ...formData.getAll("image")];
      for (const entry of imageEntries) {
        if (entry instanceof File && entry.size > 0) {
          files.push(entry);
        }
      }

      // Check max file count
      if (files.length > MAX_IMAGE_COUNT) {
        return NextResponse.json(
          { error: `You can upload a maximum of ${MAX_IMAGE_COUNT} images.` },
          { status: 400 }
        );
      }

      // Validate and save files
      const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");
      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
          return NextResponse.json(
            { error: `Invalid image type "${file.type}". Allowed: JPG, PNG, WebP, AVIF.` },
            { status: 400 }
          );
        }
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `File "${file.name}" exceeds the 5MB size limit.` },
            { status: 400 }
          );
        }

        const ext = path.extname(file.name) || ".jpg";
        const cleanBase = path
          .basename(file.name, ext)
          .replace(/[^a-zA-Z0-9_-]/g, "")
          .substring(0, 30);
        const filename = `${Date.now()}-${cleanBase || "project"}${ext}`;
        const filePath = path.join(uploadDir, filename);

        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));
        uploadedImages.push(`/uploads/projects/${filename}`);
      }

      // Also allow direct URL strings if passed
      const urlEntries = formData.getAll("imageUrl");
      for (const u of urlEntries) {
        const str = String(u).trim();
        if (str) uploadedImages.push(str);
      }
    } else {
      const body = await request.json();
      title = String(body.title ?? "").trim();
      location = String(body.location ?? "").trim();
      category = String(body.category ?? "Residential").trim() || "Residential";
      capacity = String(body.capacity ?? "").trim();
      description = String(body.description ?? "").trim();

      if (Array.isArray(body.images)) {
        for (const img of body.images) {
          if (typeof img === "string" && img.trim()) {
            uploadedImages.push(img.trim());
          }
        }
      } else if (typeof body.imageUrl === "string" && body.imageUrl.trim()) {
        uploadedImages.push(body.imageUrl.trim());
      }
    }

    const parsed = projectCreateSchema.safeParse({
      title,
      location,
      category,
      capacity,
      description,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid project data." },
        { status: 400 }
      );
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { error: "At least one project image is required." },
        { status: 400 }
      );
    }

    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const created = await Project.create({
      title: parsed.data.title,
      location: parsed.data.location,
      category: parsed.data.category,
      capacity: parsed.data.capacity,
      description: parsed.data.description,
      imageUrl: uploadedImages[0],
      images: uploadedImages,
      createdBy: user.userId,
    });

    return NextResponse.json(
      {
        id: created._id.toString(),
        _id: created._id.toString(),
        title: created.title,
        location: created.location,
        category: created.category,
        capacity: created.capacity,
        description: created.description,
        imageUrl: created.imageUrl,
        image_url: created.imageUrl,
        images: created.images,
        createdAt: created.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Could not save the project." }, { status: 500 });
  }
}