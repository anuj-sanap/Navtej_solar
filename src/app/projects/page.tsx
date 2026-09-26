import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { connectDatabase } from "@/lib/db";
import { Project } from "@/lib/models/Project";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects | Navtej Solartech Energy",
  description: "Explore our completed solar rooftop and commercial installations across Nashik and Maharashtra.",
};

export default async function ProjectsPage() {
  let projectItems: Array<{
    title: string;
    location: string;
    category: string;
    capacity: string;
    imageUrl: string;
    description: string;
    images: string[];
  }> = [];

  try {
    const db = await connectDatabase();
    if (db) {
      const dbProjects = await Project.find().sort({ createdAt: -1 }).lean();
      if (dbProjects && dbProjects.length > 0) {
        projectItems = dbProjects.map((p) => {
          const imgs = (p.images && p.images.length > 0) ? p.images : (p.imageUrl ? [p.imageUrl] : []);
          return {
            title: p.title,
            location: p.location,
            category: p.category || "Solar Installation",
            capacity: p.capacity || "",
            imageUrl: p.imageUrl || imgs[0] || "/navtej-logo.jpeg",
            description: p.description || "",
            images: imgs,
          };
        });
      }
    }
  } catch (error) {
    console.error("Failed to load projects from MongoDB:", error);
  }

  const projects = projectItems.map(
    (project) =>
      [
        project.title,
        project.location,
        project.capacity ? `${project.category} · ${project.capacity}` : project.category,
        project.imageUrl,
        project.description,
        project.images,
      ] as const
  );

  return (
    <>
      <Navbar />
      <main className="bg-background">
        <section className="bg-white py-16 sm:py-24">
          <Container>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Our work</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] text-brand-primary sm:text-6xl">
              Solar systems made for the place they live.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
              A selection of residential and commercial installations across Nashik and nearby areas.
            </p>
          </Container>
        </section>

        <section className="py-12 sm:py-20">
          <Container>
            {projects.length === 0 ? (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-10 sm:p-14 text-center shadow-sm max-w-2xl mx-auto">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-700 mb-4">
                  ☀️
                </div>
                <h2 className="text-xl font-bold text-brand-primary">Portfolio Updating</h2>
                <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                  Our portfolio is currently being refreshed. Completed solar installations published by our team will appear here directly.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href="https://wa.me/919403277273"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-[#20ba59] transition"
                  >
                    WhatsApp Us for Live Photos
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-brand-primary hover:bg-slate-100 transition"
                  >
                    Get Free Quote
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {projects.map(([title, location, category, image, description, projectImages], index) => (
                  <article
                    key={`${title}-${index}`}
                    className={`group rounded-3xl bg-white p-4 shadow-sm transition hover:shadow-md ${
                      index % 3 === 1 ? "md:translate-y-10" : ""
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                      <Image
                        src={image}
                        alt={`${category} solar project in ${location}`}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                      {projectImages && projectImages.length > 1 && (
                        <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow">
                          📷 {projectImages.length} Photos
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="mt-4 text-xs font-bold uppercase tracking-[.14em] text-[#b07d00]">
                        {location}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-brand-primary">{title}</h2>
                      <p className="mt-1 text-sm font-medium text-brand-primary/80">{category}</p>
                      {description ? (
                        <p className="mt-2 text-sm text-text-secondary leading-relaxed">{description}</p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
    </>
  );
}
