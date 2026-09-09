import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: projectRows } = await supabase.from("projects").select("id, title, location, category, capacity, description, image_url").order("created_at", { ascending: false });
  const projects = (projectRows ?? []).map((project) => [project.title, project.location, `${project.category} · ${project.capacity}`, project.image_url, project.description] as const);
  return <><Navbar /><main className="bg-background"><section className="bg-white py-16 sm:py-24"><Container><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Our work</p><h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] text-brand-primary sm:text-6xl">Solar systems made for the place they live.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">A selection of residential and commercial installations across Nashik and nearby areas.</p></Container></section><section className="py-12 sm:py-20"><Container><div className="grid gap-8 md:grid-cols-2">{projects.map(([title, location, category, image], index) => <article key={title} className={`group ${index % 3 === 1 ? "md:translate-y-10" : ""}`}><div className="relative aspect-[4/3] overflow-hidden rounded-3xl"><Image src={image} alt={`${category} solar project in ${location}`} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 768px) 50vw, 100vw" /></div><p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-[#b07d00]">{location}</p><h2 className="mt-2 text-2xl font-semibold text-brand-primary">{title}</h2><p className="mt-2 text-sm text-text-secondary">{category}</p></article>)}</div></Container></section></main></>;
}
