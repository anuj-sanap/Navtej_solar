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

const projectUpdateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  location: z.string().trim().min(1, "Location is required").max(100),
  category: z.string().trim().max(80).optional(),
  capacity: z.string().trim().max(50).optional(),
  description: z.string().trim().max(3000).optional().default(""),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const project = await Project.findById(id).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const images = (project.images && project.images.length > 0) ? project.images : (project.imageUrl ? [project.imageUrl] : []);
    const primaryImage = project.imageUrl || images[0] || "";

    return NextResponse.json({
      id: project._id.toString(),
      _id: project._id.toString(),
      title: project.title,
      location: project.location,
      category: project.category || "Residential",
      capacity: project.capacity || "",
      description: project.description || "",
      imageUrl: primaryImage,
      image_url: primaryImage,
      images,
      createdAt: project.createdAt,
    });
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to retrieve project." }, { status: 500 });
  }
}

export async function PUT(
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
    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";
    let title = "";
    let location = "";
    let category = existingProject.category || "Residential";
    let capacity = existingProject.capacity || "";
    let description = "";
    const keptImages: string[] = [];
    const newUploadedImages: string[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = String(formData.get("title") ?? existingProject.title).trim();
      location = String(formData.get("location") ?? existingProject.location).trim();
      if (formData.has("category")) category = String(formData.get("category")).trim();
      if (formData.has("capacity")) capacity = String(formData.get("capacity")).trim();
      description = String(formData.get("description") ?? "").trim();

      // Collect kept images (URLs the user didn't remove)
      const keptEntries = formData.getAll("keptImages");
      for (const entry of keptEntries) {
        const val = String(entry).trim();
        if (val) {
          try {
            // Handle if a JSON array was stringified
            if (val.startsWith("[") && val.endsWith("]")) {
              const parsed = JSON.parse(val);
              if (Array.isArray(parsed)) {
                for (const item of parsed) {
                  if (typeof item === "string" && item.trim()) keptImages.push(item.trim());
                }
              }
            } else {
              keptImages.push(val);
            }
          } catch {
            keptImages.push(val);
          }
        }
      }

      // Collect new uploaded images
      const files: File[] = [];
      const imageEntries = [...formData.getAll("images"), ...formData.getAll("image"), ...formData.getAll("newImages")];
      for (const entry of imageEntries) {
        if (entry instanceof File && entry.size > 0) {
          files.push(entry);
        }
      }

      if (keptImages.length + files.length > MAX_IMAGE_COUNT) {
        return NextResponse.json(
          { error: `A project can have a maximum of ${MAX_IMAGE_COUNT} images.` },
          { status: 400 }
        );
      }

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
        newUploadedImages.push(`/uploads/projects/${filename}`);
      }
    } else {
      const body = await request.json();
      title = String(body.title ?? existingProject.title).trim();
      location = String(body.location ?? existingProject.location).trim();
      if (body.category !== undefined) category = String(body.category).trim();
      if (body.capacity !== undefined) capacity = String(body.capacity).trim();
      description = String(body.description ?? "").trim();

      if (Array.isArray(body.keptImages)) {
        for (const img of body.keptImages) {
          if (typeof img === "string" && img.trim()) keptImages.push(img.trim());
        }
      } else if (Array.isArray(body.images)) {
        for (const img of body.images) {
          if (typeof img === "string" && img.trim()) keptImages.push(img.trim());
        }
      }
    }

    const parsed = projectUpdateSchema.safeParse({
      title,
      location,
      category,
      capacity,
      description,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid project details." },
        { status: 400 }
      );
    }

    const finalImages = [...keptImages, ...newUploadedImages];
    if (finalImages.length === 0) {
      return NextResponse.json(
        { error: "A project must have at least one image. Please keep an existing image or upload a new one." },
        { status: 400 }
      );
    }

    existingProject.title = parsed.data.title;
    existingProject.location = parsed.data.location;
    if (parsed.data.category !== undefined) existingProject.category = parsed.data.category;
    if (parsed.data.capacity !== undefined) existingProject.capacity = parsed.data.capacity;
    existingProject.description = parsed.data.description ?? "";
    existingProject.images = finalImages;
    existingProject.imageUrl = finalImages[0];

    await existingProject.save();

    return NextResponse.json({
      id: existingProject._id.toString(),
      _id: existingProject._id.toString(),
      title: existingProject.title,
      location: existingProject.location,
      category: existingProject.category,
      capacity: existingProject.capacity,
      description: existingProject.description,
      imageUrl: existingProject.imageUrl,
      image_url: existingProject.imageUrl,
      images: existingProject.images,
      updatedAt: existingProject.updatedAt,
    });
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Could not update project." }, { status: 500 });
  }
}

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
    const db = await connectDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      message: "Project deleted successfully.",
      id,
    });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Could not delete project." }, { status: 500 });
  }
}
