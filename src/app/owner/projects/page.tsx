"use client";

import { FormEvent, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function OwnerProjectsPage() {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const image = formData.get("image");
    if (!(image instanceof File) || image.size === 0) {
      setStatus("Please choose a project image.");
      setPending(false);
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const imagePath = `${crypto.randomUUID()}-${image.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const upload = await supabase.storage.from("project-images").upload(imagePath, image, { contentType: image.type, upsert: false });
    if (upload.error) {
      setStatus(upload.error.message);
      setPending(false);
      return;
    }
    const response = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: formData.get("title"), location: formData.get("location"), category: formData.get("category"), capacity: formData.get("capacity"), description: formData.get("description"), imagePath }) });
    if (!response.ok) {
      setStatus((await response.json()).error ?? "Could not save the project.");
      setPending(false);
      return;
    }
    form.reset();
    setStatus("Project published to the website.");
    setPending(false);
  }

  return <><Navbar /><main className="bg-background py-12 sm:py-20"><Container><div className="border-b border-border pb-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Admin workspace</p><h1 className="mt-3 text-4xl font-semibold text-brand-primary">Project manager</h1><p className="mt-3 text-sm text-text-secondary">Only the configured Supabase admin can publish project images to the public gallery.</p></div><form onSubmit={submit} className="mt-10 max-w-2xl rounded-3xl bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-semibold text-brand-primary">Add a project</h2><div className="mt-6 grid gap-4">{[["title", "Project title"], ["location", "Location"], ["category", "Category"], ["capacity", "Capacity"]].map(([name, label]) => <label key={name} className="text-sm font-bold text-brand-primary">{label}<input name={name} required className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary" /></label>)}<label className="text-sm font-bold text-brand-primary">Description<textarea name="description" required rows={4} className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary" /></label><label className="text-sm font-bold text-brand-primary">Project image<input name="image" type="file" accept="image/jpeg,image/png,image/webp" required className="mt-2 block w-full text-sm font-normal" /></label></div>{status && <p role="status" className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-brand-primary">{status}</p>}<button disabled={pending} className="mt-6 min-h-12 w-full rounded-full bg-brand-primary px-6 text-sm font-bold text-white disabled:opacity-60">{pending ? "Publishing..." : "Publish project"}</button></form></Container></main></>;
}
