"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";

const images = {
  hero: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2200&q=85",
  home: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
  commercial: "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80",
  project: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=1200&q=80",
};

const steps = [
  ["01", "Free site survey", "We understand your roof, usage and goals before recommending a system."],
  ["02", "Custom 3D solar design", "See your panels, production and savings with a design made for your home."],
  ["03", "Installation & subsidy", "Our certified team handles installation, documentation and subsidy guidance."],
  ["04", "After-sales support", "Stay supported with monitoring, maintenance and a dependable warranty."],
];

const services = [
  ["01", "Residential rooftop solar", "Bring dependable, lower-cost energy home with a system sized around your family.", images.home],
  ["02", "Commercial solar systems", "Make your business more resilient and reduce operating costs with clean generation.", images.commercial],
  ["03", "Maintenance & upgrades", "Keep every panel performing with proactive care, upgrades and responsive support.", images.project],
];

const projects = [
  ["Nashik Road", "5 kW rooftop system", images.home],
  ["Gangapur Road", "10 kW family home", images.project],
  ["Satpur MIDC", "25 kW commercial array", images.commercial],
];

const testimonials = [
  ["The team made subsidy paperwork simple and the installation was finished exactly when promised.", "Prasad Kulkarni", "Nashik Road"],
  ["Our monthly bill dropped dramatically. Navtej gave us clear advice without pushing a bigger system than we needed.", "Meenal Patil", "Gangapur Road"],
  ["Professional from the site visit to handover. The monitoring support has been excellent.", "Rohan Deshmukh", "Indira Nagar"],
];

export function HomeLanding() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <section id="home" className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#dce4e8] sm:min-h-[650px]">
        <Image src={images.hero} alt="Solar panels installed on a modern rooftop in warm sunlight" fill priority className="object-cover object-center brightness-[.94] contrast-[1.04] saturate-[.38] sepia-[.1] grayscale-[.08]" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,31,48,.72)_0%,rgba(28,43,61,.56)_22%,rgba(45,67,82,.3)_45%,rgba(54,80,94,.22)_65%,rgba(25,39,53,.38)_84%,rgba(13,22,32,.58)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(255,255,255,.08)_0%,rgba(255,255,255,.025)_35%,transparent_65%)] mix-blend-screen" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(to_bottom,transparent,rgba(13,22,32,.2))]" />
        <Container className="relative flex min-h-[calc(100svh-4.5rem)] items-start py-10 sm:min-h-[650px] sm:items-center sm:py-20">
          <div className="max-w-2xl">
            <p className="reveal inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#273449]/45 px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-white shadow-sm backdrop-blur-[2px]"><span className="h-2 w-2 rounded-full bg-[#d9c08a]" /> Free Site Visit in Nashik</p>
            <h1 className="reveal delay-1 mt-7 max-w-[44rem] text-[clamp(2rem,8.5vw,5.25rem)] font-semibold leading-[.98] tracking-[-.035em] text-white [text-shadow:0_2px_18px_rgba(15,23,42,.38)] sm:text-[clamp(2.7rem,6.4vw,5.25rem)]"><span className="block whitespace-nowrap">Power Your Home</span><span className="block whitespace-nowrap">with <span className="text-[#d4bd8c]">Clean, Reliable</span></span><span className="block text-[#d4bd8c]">Solar</span></h1>
            <p className="reveal delay-2 mt-6 max-w-xl text-base leading-7 text-[#f3f4f6] [text-shadow:0_2px_14px_rgba(15,23,42,.58)] sm:text-lg">Turn your rooftop into a reliable source of clean power. We manage installation, subsidy assistance, net metering and after-sales support from start to finish.</p>
            <div className="reveal delay-3 mt-8 flex flex-wrap gap-3">
              <Link href="#quote" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-[#1f2937] shadow-[0_12px_30px_rgba(15,23,42,.3)] transition hover:-translate-y-1 hover:bg-[#f3f4f6]">Get Free Quote <span className="ml-2">↗</span></Link>
              <a href="tel:+919876543210" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 bg-[#273449]/40 px-6 text-sm font-bold text-white ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-[#273449]/65">Call Now</a>
              <a href="https://wa.me/919876543210" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d9c08a]/50 bg-[#d9c08a]/90 px-5 text-sm font-bold text-[#1f2937] transition hover:-translate-y-1 hover:bg-[#d9c08a]">WhatsApp</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-white/85"><span>✓ MNRE guidance</span><span>✓ Net metering support</span><span>✓ 25-year panel warranty</span></div>
          </div>
        </Container>
      </section>

      <section aria-label="Navtej Solartech Energy trust statistics" className="relative z-10 -mt-8">
        <Container><div className="grid grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-[0_16px_45px_rgba(11,37,90,.1)] sm:grid-cols-4">
          {[['8+', 'Years of experience'], ['500+', 'Homes powered'], ['70%', 'Average savings'], ['25 yrs', 'Panel warranty']].map(([value, label]) => <div key={label} className="border-b border-slate-100 px-5 py-6 text-center last:border-0 sm:border-b-0 sm:border-r sm:last:border-0"><strong className="block text-3xl font-bold tracking-tight text-brand-primary">{value}</strong><span className="mt-1 block text-xs font-semibold text-slate-500">{label}</span></div>)}
        </div></Container>
      </section>

      <section className="bg-white py-24 sm:py-32" aria-labelledby="steps-heading">
        <Container><div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">A clearer way to go solar</p><h2 id="steps-heading" className="mt-4 max-w-md text-4xl font-semibold leading-tight text-brand-primary sm:text-5xl">Powering your home in 4 simple steps.</h2><p className="mt-5 max-w-md leading-7 text-slate-600">Your solar journey should feel exciting, not complicated. Our local team stays with you at every stage.</p><Link href="#quote" className="mt-7 inline-flex items-center text-sm font-bold text-brand-primary hover:text-[#b07d00]">Start with a free site visit <span className="ml-2">→</span></Link></div><div className="grid gap-3 sm:grid-cols-2">{steps.map(([number, title, description]) => <button type="button" key={number} className="group min-h-32 text-left rounded-2xl border border-slate-200 bg-[#f7f8fa] p-5 text-brand-primary transition-all hover:-translate-y-1 hover:border-brand-primary/30 hover:bg-brand-primary hover:text-white focus-visible:border-brand-primary focus-visible:bg-brand-primary focus-visible:text-white"><span className="text-xs font-bold text-[#b07d00] group-hover:text-brand-secondary group-focus-visible:text-brand-secondary">{number}</span><h3 className="mt-4 text-xl font-semibold">{title}</h3><p className="mt-2 max-h-0 overflow-hidden text-sm leading-6 text-white/75 opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100">{description}</p></button>)}</div></div></Container>
      </section>

      <section id="services" className="bg-[#f1f4f7] py-24 sm:py-32" aria-labelledby="services-heading"><Container><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">What we do</p><h2 id="services-heading" className="mt-4 text-4xl font-semibold text-brand-primary sm:text-5xl">Solar that fits real life.</h2></div><Link href="/services" className="text-sm font-bold text-brand-primary">View all services <span className="ml-2">→</span></Link></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{services.map(([number, title, description, image]) => <article key={title} className="group overflow-hidden rounded-3xl bg-white shadow-[0_10px_28px_rgba(11,37,90,.06)]"><div className="relative h-52 overflow-hidden"><Image src={image} alt={`${title} solar installation`} fill loading="lazy" className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" /></div><div className="p-6"><span className="text-xs font-bold text-[#b07d00]">{number}</span><h3 className="mt-3 text-2xl font-semibold text-brand-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p><Link href="/services" className="mt-5 inline-flex text-sm font-bold text-brand-primary">Explore service <span className="ml-2 transition group-hover:translate-x-1">→</span></Link></div></article>)}</div></Container></section>

      <section className="bg-brand-primary py-20 text-white sm:py-24" aria-labelledby="tools-heading"><Container><div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">Make a confident decision</p><h2 id="tools-heading" className="mt-4 text-4xl font-semibold sm:text-5xl">See what solar can do for you.</h2></div><p className="max-w-sm text-sm leading-6 text-white/65">Get an early view of your savings and how solar could look on your roof.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2"><Link href="/calculator" className="group rounded-3xl border border-white/15 bg-white/[.08] p-7 transition hover:-translate-y-1 hover:bg-white/[.13]"><span className="text-3xl text-brand-secondary">↗</span><h3 className="mt-8 text-2xl font-semibold">Solar Calculator</h3><p className="mt-2 text-sm text-white/65">Estimate your system size, investment and monthly savings.</p><span className="mt-7 inline-flex rounded-full bg-brand-secondary px-5 py-2.5 text-xs font-bold text-brand-primary">Calculate savings</span></Link><Link href="/contact" className="group rounded-3xl border border-white/15 bg-white/[.08] p-7 transition hover:-translate-y-1 hover:bg-white/[.13]"><span className="text-3xl text-brand-secondary">⌁</span><h3 className="mt-8 text-2xl font-semibold">3D Solar Preview</h3><p className="mt-2 text-sm text-white/65">Talk to our team about a design made for your roof and lifestyle.</p><span className="mt-7 inline-flex rounded-full bg-white px-5 py-2.5 text-xs font-bold text-brand-primary">Request preview</span></Link></div></Container></section>

      <section id="projects" className="bg-white py-24 sm:py-32" aria-labelledby="projects-heading"><Container><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Built around Nashik</p><h2 id="projects-heading" className="mt-4 text-4xl font-semibold text-brand-primary sm:text-5xl">Recent installations.</h2></div><Link href="/projects" className="text-sm font-bold text-brand-primary">View project gallery <span className="ml-2">→</span></Link></div><div className="mt-12 grid gap-5 md:grid-cols-3">{projects.map(([location, size, image], index) => <article key={location} className={`group ${index === 1 ? 'md:translate-y-8' : ''}`}><div className="relative aspect-[4/3] overflow-hidden rounded-3xl"><Image src={image} alt={`${size} solar installation in ${location}`} fill loading="lazy" className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 768px) 33vw, 100vw" /></div><p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-[#b07d00]">{location}</p><h3 className="mt-2 text-xl font-semibold text-brand-primary">{size}</h3></article>)}</div></Container></section>

      <section className="overflow-hidden bg-brand-primary py-24 text-white sm:py-32" aria-labelledby="reviews-heading"><Container><div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">What our customers say</p><h2 id="reviews-heading" className="mt-4 max-w-xl text-4xl font-semibold sm:text-5xl">Good energy, from people who made the switch.</h2></div><div className="flex flex-wrap gap-3 text-xs font-bold text-white/75"><span className="rounded-full border border-white/15 px-4 py-2">★ Quality assurance</span><span className="rounded-full border border-white/15 px-4 py-2">★ Expert support</span><span className="rounded-full border border-white/15 px-4 py-2">★ Reliable warranty</span></div></div><div className="mt-12 flex snap-x gap-4 overflow-x-auto pb-5">{testimonials.map(([quote, name, location]) => <article key={name} className="min-w-[min(86vw,390px)] snap-start rounded-3xl bg-white p-7 text-brand-primary shadow-xl"><div className="text-lg tracking-[.22em] text-[#d39c00]">★★★★★</div><p className="mt-6 text-lg leading-8">“{quote}”</p><p className="mt-8 text-sm font-bold">{name}</p><p className="mt-1 text-xs text-slate-500">{location}, Nashik</p></article>)}</div></Container></section>

      <section id="quote" className="bg-[#f1f4f7] py-24 sm:py-32" aria-labelledby="quote-heading"><Container><div className="grid gap-10 lg:grid-cols-[1fr_.86fr] lg:items-stretch"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Your next step</p><h2 id="quote-heading" className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-brand-primary sm:text-5xl">Get a free solar quote for your home.</h2><p className="mt-5 max-w-md leading-7 text-slate-600">Tell us a little about your energy needs. A solar advisor from Nashik will call you with a clear recommendation.</p><div className="relative mt-9 min-h-64 overflow-hidden rounded-3xl"><Image src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80" alt="Map view representing solar service areas across Nashik" fill loading="lazy" className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" /><div className="absolute inset-0 bg-brand-primary/10" /><div className="absolute left-[48%] top-[42%] flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-brand-primary shadow-lg"><span className="h-2.5 w-2.5 rounded-full bg-[#e84b4b]" /> Nashik</div><p className="absolute bottom-4 left-4 rounded-full bg-brand-primary/90 px-4 py-2 text-xs font-bold text-white">Serving Nashik & nearby areas</p></div></div><form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-[0_14px_36px_rgba(11,37,90,.08)] sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="text-xs font-bold text-brand-primary sm:col-span-2">Full name<input required name="name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-brand-primary" placeholder="Your name" /></label><label className="text-xs font-bold text-brand-primary">Phone number<input required type="tel" name="phone" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-brand-primary" placeholder="+91" /></label><label className="text-xs font-bold text-brand-primary">Location<input required name="location" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-brand-primary" placeholder="Area in Nashik" /></label><label className="text-xs font-bold text-brand-primary">Plot / roof size<input name="plot-size" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-brand-primary" placeholder="e.g. 1200 sq ft" /></label><label className="text-xs font-bold text-brand-primary">Monthly electricity bill<input name="bill" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-brand-primary" placeholder="e.g. ₹3,500" /></label></div><button type="submit" className="mt-7 w-full rounded-full bg-brand-primary px-6 py-4 text-sm font-bold text-white transition hover:bg-brand-primary-hover">{submitted ? "Thank you, we will call soon" : "Request my free quote →"}</button><p className="mt-4 text-center text-[11px] text-slate-400">No obligation. Your details stay private.</p></form></div></Container></section>
    </>
  );
}
