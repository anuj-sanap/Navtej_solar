import { HomeLanding } from "@/components/home/HomeLanding";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main><HomeLanding /></main>
      <footer className="bg-[#071b43] py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
          <div><p className="font-serif text-2xl font-semibold">Navtej Solartech Energy</p><p className="mt-4 max-w-xs text-sm leading-6 text-white/60">Powering Nashik with clean, reliable solar energy.</p><a href="https://wa.me/919876543210" className="mt-6 inline-flex rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white">WhatsApp us</a></div>
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffd23f]">Explore</p><div className="mt-4 grid gap-3 text-sm text-white/65"><a href="#services" className="hover:text-white">Services</a><a href="#projects" className="hover:text-white">Projects</a><a href="/about" className="hover:text-white">About us</a><a href="/contact" className="hover:text-white">Contact</a></div></div>
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffd23f]">Services</p><div className="mt-4 grid gap-3 text-sm text-white/65"><a href="/services" className="hover:text-white">Residential solar</a><a href="/services" className="hover:text-white">Commercial solar</a><a href="/services" className="hover:text-white">Maintenance</a><a href="/calculator" className="hover:text-white">Solar calculator</a></div></div>
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffd23f]">Get in touch</p><div className="mt-4 grid gap-3 text-sm text-white/65"><a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a><a href="mailto:hello@navtejsolartech.in" className="hover:text-white">hello@navtejsolartech.in</a><p>Nashik, Maharashtra</p></div></div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 px-5 pt-6 text-xs text-white/40 sm:px-6 lg:px-8">© 2026 Navtej Solartech Energy. Powering Nashik with clean, reliable solar energy.</div>
      </footer>
    </>
  );
}
