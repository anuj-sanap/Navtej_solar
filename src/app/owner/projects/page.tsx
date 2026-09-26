/* eslint-disable @next/next/no-img-element */
"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { OwnerHeader } from "@/components/owner/OwnerHeader";

interface ProjectItem {
  id: string;
  _id?: string;
  title: string;
  location: string;
  category?: string;
  capacity?: string;
  description?: string;
  imageUrl: string;
  images?: string[];
  createdAt?: string;
}

export default function OwnerProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Add Form state
  const [addPending, setAddPending] = useState(false);
  const [addStatus, setAddStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modal state
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editCategory, setEditCategory] = useState("Residential");
  const [editCapacity, setEditCapacity] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editKeptImages, setEditKeptImages] = useState<string[]>([]);
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]);
  const [editPending, setEditPending] = useState(false);
  const [editError, setEditError] = useState("");
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation Modal state
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function loadProjects() {
    try {
      setLoading(true);
      setFetchError("");
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch projects.");
      }
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  // Handle file selection in Add Form
  function handleAddFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 10));
    e.target.value = "";
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // Handle Add Submit
  async function handleAddSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddPending(true);
    setAddStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = String(formData.get("title") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();

    if (!title || !location) {
      setAddStatus({ type: "error", message: "Title and location are required." });
      setAddPending(false);
      return;
    }

    if (selectedFiles.length === 0) {
      setAddStatus({ type: "error", message: "Please select at least one project image." });
      setAddPending(false);
      return;
    }

    // Append files
    const uploadData = new FormData();
    uploadData.append("title", title);
    uploadData.append("location", location);
    uploadData.append("category", String(formData.get("category") ?? "Residential").trim() || "Residential");
    uploadData.append("capacity", String(formData.get("capacity") ?? "").trim());
    uploadData.append("description", String(formData.get("description") ?? "").trim());

    for (const file of selectedFiles) {
      uploadData.append("images", file);
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();
      if (!response.ok) {
        setAddStatus({ type: "error", message: result.error || "Could not publish project." });
        setAddPending(false);
        return;
      }

      form.reset();
      setSelectedFiles([]);
      setAddStatus({ type: "success", message: "Project published successfully to live gallery!" });
      loadProjects();
    } catch {
      setAddStatus({ type: "error", message: "Network error occurred while publishing project." });
    } finally {
      setAddPending(false);
    }
  }

  // Open Edit Modal
  function startEdit(project: ProjectItem) {
    setEditingProject(project);
    setEditTitle(project.title);
    setEditLocation(project.location);
    setEditCategory(project.category || "Residential");
    setEditCapacity(project.capacity || "");
    setEditDescription(project.description || "");
    const images = project.images && project.images.length > 0 ? project.images : [project.imageUrl].filter(Boolean);
    setEditKeptImages(images);
    setEditNewFiles([]);
    setEditError("");
  }

  function handleEditFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setEditNewFiles((prev) => [...prev, ...files].slice(0, 10 - editKeptImages.length));
    e.target.value = "";
  }

  function removeKeptImage(imgUrl: string) {
    setEditKeptImages((prev) => prev.filter((u) => u !== imgUrl));
  }

  function removeEditNewFile(index: number) {
    setEditNewFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // Handle Edit Submit
  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editingProject) return;

    if (!editTitle.trim() || !editLocation.trim()) {
      setEditError("Title and location are required.");
      return;
    }

    if (editKeptImages.length === 0 && editNewFiles.length === 0) {
      setEditError("A project must have at least one image. Please keep an existing image or upload a new one.");
      return;
    }

    setEditPending(true);
    setEditError("");

    const formData = new FormData();
    formData.append("title", editTitle.trim());
    formData.append("location", editLocation.trim());
    formData.append("category", editCategory.trim());
    formData.append("capacity", editCapacity.trim());
    formData.append("description", editDescription.trim());

    for (const img of editKeptImages) {
      formData.append("keptImages", img);
    }

    for (const file of editNewFiles) {
      formData.append("newImages", file);
    }

    try {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        setEditError(result.error || "Failed to update project.");
        setEditPending(false);
        return;
      }

      setEditingProject(null);
      loadProjects();
    } catch {
      setEditError("Network error occurred while updating project.");
    } finally {
      setEditPending(false);
    }
  }

  // Handle Delete Confirmation
  async function handleDeleteConfirm() {
    if (!deletingProject) return;
    setDeletePending(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/projects/${deletingProject.id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) {
        setDeleteError(result.error || "Failed to delete project.");
        setDeletePending(false);
        return;
      }

      setDeletingProject(null);
      loadProjects();
    } catch {
      setDeleteError("Network error occurred while deleting project.");
    } finally {
      setDeletePending(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen py-10 sm:py-16">
        <Container>
          <OwnerHeader
            title="Completed Projects"
            description="Manage completed solar projects displayed in the public showcase and homepage."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_.9fr] items-start">
            {/* Add New Project Card */}
            <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 border border-border">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-semibold text-brand-primary">Add New Installation</h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    Required: Title, Location, and &ge;1 Image. Description is optional.
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  New Project
                </span>
              </div>

              <form onSubmit={handleAddSubmit} className="mt-6 grid gap-4">
                <div>
                  <label htmlFor="proj-title" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="proj-title"
                    name="title"
                    required
                    placeholder="e.g. 10 kW Residential Solar Array"
                    className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="proj-location" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="proj-location"
                      name="location"
                      required
                      placeholder="e.g. Gangapur Road, Nashik"
                      className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="proj-capacity" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                      Capacity <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="proj-capacity"
                      name="capacity"
                      placeholder="e.g. 10 kW"
                      className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="proj-category" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Category <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <select
                    id="proj-category"
                    name="category"
                    defaultValue="Residential"
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  >
                    <option value="Residential">Residential Solar</option>
                    <option value="Commercial">Commercial Solar</option>
                    <option value="Industrial">Industrial Solar</option>
                    <option value="Agricultural">Agricultural Solar</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="proj-desc" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Description <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="proj-desc"
                    name="description"
                    rows={3}
                    placeholder="Details about panels, inverter, annual generation, savings (optional)..."
                    className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  />
                </div>

                {/* Multi-image upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Project Images <span className="text-red-500">* (at least 1 required)</span>
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      ref={addFileInputRef}
                      type="file"
                      id="add-images-input"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      multiple
                      onChange={handleAddFilesChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => addFileInputRef.current?.click()}
                      className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs font-semibold text-brand-primary hover:bg-slate-100 hover:border-brand-primary transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Choose Images (Max 10)
                    </button>
                    <span className="text-xs text-text-secondary">
                      {selectedFiles.length} image{selectedFiles.length === 1 ? "" : "s"} selected
                    </span>
                  </div>

                  {/* Previews of selected files */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      {selectedFiles.map((file, idx) => (
                        <div key={`${file.name}-${idx}`} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-slate-300 bg-white">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(idx)}
                            aria-label={`Remove image ${file.name}`}
                            className="absolute top-0.5 right-0.5 rounded-full bg-red-600 p-0.5 text-white opacity-80 hover:opacity-100 transition shadow"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-brand-primary/80 text-[8px] font-bold text-white text-center py-0.5">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Supported: JPG, PNG, WebP, AVIF (max 5MB each).
                  </p>
                </div>

                {addStatus && (
                  <div
                    role="alert"
                    className={`rounded-xl px-4 py-3 text-xs font-semibold ${
                      addStatus.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {addStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={addPending}
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 text-sm font-bold text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
                >
                  {addPending ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Uploading &amp; Publishing...</span>
                    </>
                  ) : (
                    <span>Publish Project</span>
                  )}
                </button>
              </form>
            </section>

            {/* Existing Projects List */}
            <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 border border-border">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-semibold text-brand-primary">Live Installations</h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    {projects.length} project{projects.length === 1 ? "" : "s"} live in gallery
                  </p>
                </div>
                <button
                  onClick={loadProjects}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  title="Refresh list"
                >
                  ↻ Refresh
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
                  <p className="mt-3">Loading projects from database...</p>
                </div>
              ) : fetchError ? (
                <div className="py-8 text-center">
                  <p className="text-xs font-semibold text-red-600">{fetchError}</p>
                  <button
                    onClick={loadProjects}
                    className="mt-3 rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-primary-hover"
                  >
                    Try Again
                  </button>
                </div>
              ) : projects.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-600">No completed projects yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Use the form on the left to add your first solar project.
                  </p>
                </div>
              ) : (
                <div className="mt-6 divide-y divide-slate-100 max-h-[700px] overflow-y-auto pr-1">
                  {projects.map((proj) => {
                    const images = (proj.images && proj.images.length > 0) ? proj.images : [proj.imageUrl].filter(Boolean);
                    return (
                      <article key={proj.id} className="py-4.5 flex gap-4 items-start group">
                        {/* Thumbnail */}
                        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                          <Image
                            src={proj.imageUrl || "/navtej-logo.jpeg"}
                            alt={proj.title}
                            fill
                            className="object-cover"
                          />
                          {images.length > 1 && (
                            <span className="absolute bottom-1 right-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-white">
                              {images.length} photos
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-brand-primary text-sm leading-snug truncate">
                              {proj.title}
                            </h3>
                          </div>
                          <p className="text-xs font-medium text-amber-700 mt-0.5">
                            📍 {proj.location}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                            {proj.capacity && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700 font-medium">
                                ⚡ {proj.capacity}
                              </span>
                            )}
                            {proj.category && (
                              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-700 font-medium">
                                {proj.category}
                              </span>
                            )}
                          </div>
                          {proj.description && (
                            <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {proj.description}
                            </p>
                          )}

                          {/* Action Buttons */}
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(proj)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-brand-primary hover:bg-slate-50 transition"
                            >
                              ✎ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingProject(proj)}
                              className="rounded-lg border border-red-200 bg-red-50/50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100/60 transition"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </Container>
      </main>

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 id="edit-dialog-title" className="text-xl font-bold text-brand-primary">
                Edit Installation
              </h2>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                aria-label="Close dialog"
                className="rounded-full p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-6 grid gap-4">
              <div>
                <label htmlFor="edit-title" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-location" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-location"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  />
                </div>

                <div>
                  <label htmlFor="edit-capacity" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Capacity
                  </label>
                  <input
                    id="edit-capacity"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    placeholder="e.g. 10 kW"
                    className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-category" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Category
                </label>
                <select
                  id="edit-category"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                >
                  <option value="Residential">Residential Solar</option>
                  <option value="Commercial">Commercial Solar</option>
                  <option value="Industrial">Industrial Solar</option>
                  <option value="Agricultural">Agricultural Solar</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-desc" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="edit-desc"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  placeholder="Details about panels, inverter, annual generation, savings (optional)..."
                  className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                />
              </div>

              {/* Manage Existing Images */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Current Images ({editKeptImages.length})
                </label>
                {editKeptImages.length === 0 ? (
                  <p className="mt-2 text-xs text-red-500 font-semibold">
                    All existing images removed. You MUST upload at least one new image below.
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    {editKeptImages.map((imgUrl, idx) => (
                      <div key={imgUrl} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-slate-300 bg-white">
                        <img
                          src={imgUrl}
                          alt="Project image"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeKeptImage(imgUrl)}
                          aria-label="Remove image"
                          className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-85 hover:opacity-100 transition shadow"
                          title="Remove image"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-brand-primary/80 text-[8px] font-bold text-white text-center py-0.5">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Additional Images */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Upload Additional Images
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    ref={editFileInputRef}
                    type="file"
                    id="edit-new-images-input"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    onChange={handleEditFilesChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-brand-primary hover:bg-slate-100 hover:border-brand-primary transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Photos
                  </button>
                  <span className="text-xs text-text-secondary">
                    {editNewFiles.length} new image{editNewFiles.length === 1 ? "" : "s"} added
                  </span>
                </div>

                {editNewFiles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    {editNewFiles.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-slate-300 bg-white">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeEditNewFile(idx)}
                          aria-label={`Remove new image ${file.name}`}
                          className="absolute top-0.5 right-0.5 rounded-full bg-red-600 p-0.5 text-white opacity-85 hover:opacity-100 transition shadow"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {editError && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                  {editError}
                </div>
              )}

              <div className="mt-4 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  disabled={editPending}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editPending}
                  className="flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-primary-hover disabled:opacity-60 transition"
                >
                  {editPending ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 id="delete-dialog-title" className="text-lg font-bold text-brand-primary">
              Delete Project
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-brand-primary font-semibold">&ldquo;{deletingProject.title}&rdquo;</strong>?
              This action cannot be undone and will remove it from the public portfolio immediately.
            </p>

            {deleteError && (
              <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
                disabled={deletePending}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deletePending}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60 transition"
              >
                {deletePending ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
