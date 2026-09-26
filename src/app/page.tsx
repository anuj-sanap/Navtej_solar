import Link from "next/link";
import { HomeLanding } from "@/components/home/HomeLanding";
import { Navbar } from "@/components/layout/Navbar";
import { connectDatabase } from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { Testimonial } from "@/lib/models/Testimonial";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let projectsData: Array<{ title: string; location: string; imageUrl: string }> = [];
  let testimonialsData: Array<{ quote: string; name: string; location: string }> | undefined;

  try {
    const db = await connectDatabase();
    if (db) {
      const dbProjects = await Project.find().sort({ createdAt: -1 }).limit(6).lean();
      if (dbProjects && dbProjects.length > 0) {
        projectsData = dbProjects.map((p) => {
          const imgs = (p.images && p.images.length > 0) ? p.images : (p.imageUrl ? [p.imageUrl] : []);
          return {
            title: p.title,
            location: p.location,
            imageUrl: p.imageUrl || imgs[0] || "/navtej-logo.jpeg",
          };
        });
      }

      const dbTestimonials = await Testimonial.find().sort({ createdAt: -1 }).limit(10).lean();
      if (dbTestimonials && dbTestimonials.length > 0) {
        testimonialsData = dbTestimonials.map((t) => ({
          quote: t.quote,
          name: t.name,
          location: t.location || "Nashik",
        }));
      }
    }
  } catch (err) {
    console.error("Error loading home page database content:", err);
  }

  return (
    <>
      <Navbar />
      <main>
        <HomeLanding
          initialProjects={projectsData}
          initialTestimonials={testimonialsData}
        />
      </main>
      <footer className="bg-[#071b43] py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <p className="text-2xl font-semibold">Navtej Solartech Energy</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">Powering Nashik with clean, reliable solar energy.</p>
            <a href="https://wa.me/919403277273" target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white">
              WhatsApp us
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffd23f]">Explore</p>
            <div className="mt-4 grid gap-3 text-sm text-white/65">
              <a href="#services" className="hover:text-white">Services</a>
              <Link href="/projects" className="hover:text-white">Projects</Link>
              <a href="/about" className="hover:text-white">About us</a>
              <a href="/contact" className="hover:text-white">Contact</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffd23f]">Services</p>
            <div className="mt-4 grid gap-3 text-sm text-white/65">
              <a href="/services" className="hover:text-white">Residential solar</a>
              <a href="/services" className="hover:text-white">Commercial solar</a>
              <a href="/services" className="hover:text-white">Maintenance</a>
              <a href="/calculator" className="hover:text-white">Solar calculator</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffd23f]">Get in touch</p>
            <div className="mt-4 grid gap-3 text-sm text-white/65">
              <a href="tel:+919403277273" className="hover:text-white">+91 94032 77273</a>
              <a href="mailto:hello@navtejsolartech.in" className="hover:text-white">hello@navtejsolartech.in</a>
              <p>Nashik, Maharashtra</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 px-5 pt-6 text-xs text-white/40 sm:px-6 lg:px-8">
          © 2026 Navtej Solartech Energy. Powering Nashik with clean, reliable solar energy.
        </div>
      </footer>
    </>
  );
}
