"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";

const images = {
  hero: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2200&q=85",
  home: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
  commercial: "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80",
  project: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=1200&q=80",
};

const steps = [
  ["01", "Free site survey", "We understand your roof, usage and goals before recommending a system."],
  ["02", "Custom solar design", "We plan a system around your roof, energy use and long-term goals."],
  ["03", "Installation & subsidy", "Our certified team handles installation, documentation and subsidy guidance."],
  ["04", "After-sales support", "Stay supported with monitoring, maintenance and a dependable warranty."],
];

const services = [
  ["01", "Residential rooftop solar", "Bring dependable, lower-cost energy home with a system sized around your family.", images.home],
  ["02", "Commercial solar systems", "Make your business more resilient and reduce operating costs with clean generation.", images.commercial],
  ["03", "Maintenance & upgrades", "Keep every panel performing with proactive care, upgrades and responsive support.", images.project],
];

export interface HomeProject {
  location: string;
  title: string;
  imageUrl: string;
}

export interface HomeTestimonial {
  id?: string;
  quote: string;
  name: string;
  location: string;
  rating?: number;
  serviceType?: string;
}

interface HomeLandingProps {
  initialProjects?: HomeProject[];
  initialTestimonials?: HomeTestimonial[];
}


const defaultTestimonials: HomeTestimonial[] = [
  { quote: "The team made subsidy paperwork simple and the installation was finished exactly when promised.", name: "Prasad Kulkarni", location: "Nashik Road", rating: 5, serviceType: "Rooftop Solar Installation (Offline)" },
  { quote: "Our monthly bill dropped dramatically. Navtej gave us clear advice without pushing a bigger system than we needed.", name: "Meenal Patil", location: "Gangapur Road", rating: 5, serviceType: "Offline Solar Service" },
  { quote: "Professional from the site visit to handover. The monitoring support has been excellent.", name: "Rohan Deshmukh", location: "Indira Nagar", rating: 5, serviceType: "Commercial Solar Project" },
];

export function HomeLanding({ initialProjects, initialTestimonials }: HomeLandingProps = {}) {
  const [liveProjects, setLiveProjects] = useState<HomeProject[]>(
    initialProjects && initialProjects.length > 0 ? initialProjects : []
  );
  const [liveTestimonials, setLiveTestimonials] = useState<HomeTestimonial[]>(
    initialTestimonials && initialTestimonials.length > 0 ? initialTestimonials : defaultTestimonials
  );

  // Customer review submission state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewQuote, setReviewQuote] = useState("");
  const [reviewLocation, setReviewLocation] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewServiceType, setReviewServiceType] = useState("Rooftop Solar Installation (Offline)");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  async function handleReviewSubmit(e: FormEvent) {
    e.preventDefault();
    if (!reviewName.trim() || !reviewQuote.trim()) {
      setReviewError("Please enter your name and feedback.");
      return;
    }

    setReviewSubmitting(true);
    setReviewError("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reviewName.trim(),
          quote: reviewQuote.trim(),
          location: reviewLocation.trim(),
          rating: reviewRating,
          serviceType: reviewServiceType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setLiveTestimonials((prev) => [
        {
          quote: data.quote,
          name: data.name,
          location: data.location || "Nashik",
          rating: data.rating || 5,
          serviceType: data.serviceType,
        },
        ...prev,
      ]);

      setReviewSuccess(true);
      setReviewName("");
      setReviewQuote("");
      setReviewLocation("");
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Error submitting review.");
    } finally {
      setReviewSubmitting(false);
    }
  }

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLiveProjects(
            data.slice(0, 6).map((p: { title: string; location: string; imageUrl?: string }) => ({
              location: p.location || "Nashik",
              title: p.title,
              imageUrl: p.imageUrl || "/navtej-logo.jpeg",
            }))
          );
        }
      })
      .catch(() => {});

    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveTestimonials(
            data.map((t: { quote: string; name: string; location?: string }) => ({
              quote: t.quote,
              name: t.name,
              location: t.location || "Nashik",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState<{ name: string; location: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const form = formRef.current ?? event.currentTarget;
    if (!form) {
      setSubmitting(false);
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const plotRaw = String(formData.get("plot-size") || "").replace(/[^0-9.]/g, "");
    const billRaw = String(formData.get("bill") || "").replace(/[^0-9.]/g, "");

    const plotSize = plotRaw ? Number(plotRaw) : undefined;
    const electricityBill = billRaw ? Number(billRaw) : undefined;

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          location,
          plotSize,
          electricityBill,
          message: `Homepage quick quote request for ${location}. Plot: ${plotRaw || "Not specified"} sq ft, Bill: ₹${billRaw || "Not specified"}.`,
          source: "homepage_quote",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit quote enquiry.");

      setSubmittedInfo({ name, location });
      setSubmitted(true);
      formRef.current?.reset();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to send enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const ownerPhone = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "919403277273";

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
              <a href={`tel:+${ownerPhone}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 bg-[#273449]/40 px-6 text-sm font-bold text-white ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-[#273449]/65">Call Now</a>
              <a href={`https://wa.me/${ownerPhone}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d9c08a]/50 bg-[#d9c08a]/90 px-5 text-sm font-bold text-[#1f2937] transition hover:-translate-y-1 hover:bg-[#d9c08a]">WhatsApp</a>
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

      <section className="bg-brand-primary py-20 text-white sm:py-24" aria-labelledby="tools-heading"><Container><div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">Make a confident decision</p><h2 id="tools-heading" className="mt-4 text-4xl font-semibold sm:text-5xl">See what solar can do for you.</h2></div><p className="max-w-sm text-sm leading-6 text-white/65">Estimate your savings and speak with our team about the right system for your property.</p></div><div className="mt-10"><Link href="/calculator" className="group block rounded-3xl border border-white/15 bg-white/[.08] p-7 transition hover:-translate-y-1 hover:bg-white/[.13]"><span className="text-3xl text-brand-secondary">↗</span><h3 className="mt-8 text-2xl font-semibold">Solar Calculator</h3><p className="mt-2 text-sm text-white/65">Estimate your system size, investment and monthly savings (sign-in required).</p><span className="mt-7 inline-flex rounded-full bg-brand-secondary px-5 py-2.5 text-xs font-bold text-brand-primary">Calculate savings</span></Link></div></Container></section>

      {liveProjects.length > 0 && (
        <section id="projects" className="bg-white py-24 sm:py-32" aria-labelledby="projects-heading"><Container><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Built around Nashik</p><h2 id="projects-heading" className="mt-4 text-4xl font-semibold text-brand-primary sm:text-5xl">Recent installations.</h2></div><Link href="/projects" className="text-sm font-bold text-brand-primary">View project gallery <span className="ml-2">→</span></Link></div><div className="mt-12 grid gap-5 md:grid-cols-3">{liveProjects.map((project, index) => <article key={`${project.title}-${index}`} className={`group ${index === 1 ? 'md:translate-y-8' : ''}`}><div className="relative aspect-[4/3] overflow-hidden rounded-3xl"><Image src={project.imageUrl} alt={`${project.title} solar installation in ${project.location}`} fill loading="lazy" className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 768px) 33vw, 100vw" /></div><p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-[#b07d00]">{project.location}</p><h3 className="mt-2 text-xl font-semibold text-brand-primary">{project.title}</h3></article>)}</div></Container></section>
      )}

      <section className="overflow-hidden bg-brand-primary py-24 text-white sm:py-32" aria-labelledby="reviews-heading">
        <Container>
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">
                What our customers say
              </p>
              <h2 id="reviews-heading" className="mt-4 max-w-xl text-4xl font-semibold sm:text-5xl">
                Good energy, from people who made the switch.
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setReviewModalOpen(true);
                  setReviewSuccess(false);
                  setReviewError("");
                }}
                className="rounded-full bg-brand-secondary px-5 py-2.5 text-xs font-bold text-brand-primary shadow-lg hover:brightness-105 transition"
              >
                ★ Rate Navtej Solar / Share Experience
              </button>
              <div className="hidden sm:flex flex-wrap gap-2 text-xs font-bold text-white/75">
                <span className="rounded-full border border-white/15 px-3.5 py-2">★ Quality assurance</span>
                <span className="rounded-full border border-white/15 px-3.5 py-2">★ Verified reviews</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex snap-x gap-4 overflow-x-auto pb-5">
            {liveTestimonials.map((t, index) => (
              <article
                key={`${t.name}-${index}`}
                className="min-w-[min(86vw,390px)] snap-start rounded-3xl bg-white p-7 text-brand-primary shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg tracking-[.22em] text-[#d39c00]">
                      {"★".repeat(t.rating || 5)}
                    </div>
                    {t.serviceType && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                        {t.serviceType.replace(/\(.*\)/, "").trim()}
                      </span>
                    )}
                  </div>
                  <p className="mt-5 text-base leading-7 text-slate-700">“{t.quote}”</p>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-sm font-bold text-brand-primary">{t.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t.location}
                    {t.location && !t.location.toLowerCase().includes("nashik") ? ", Nashik" : ""}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="quote" className="bg-[#f1f4f7] py-24 sm:py-32" aria-labelledby="quote-heading">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_.86fr] lg:items-stretch">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Your next step</p>
              <h2 id="quote-heading" className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-brand-primary sm:text-5xl">
                Get a free solar quote for your home.
              </h2>
              <p className="mt-5 max-w-md leading-7 text-slate-600">
                Tell us a little about your energy needs. Submitting sends your details directly to the owner on WhatsApp for an immediate response.
              </p>
              <div className="relative mt-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-md">
                {/* Embedded Interactive Google Map of Nashik */}
                <div className="relative h-72 sm:h-80 w-full">
                  <iframe
                    title="Navtej Solar Service Map - Nashik, Maharashtra"
                    src="https://maps.google.com/maps?q=Nashik,%20Maharashtra,%20India&t=&z=12&ie=UTF8&iwloc=&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Overlaid badges */}
                <div className="pointer-events-none absolute left-3.5 top-3.5 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-primary shadow-md backdrop-blur-sm border border-slate-200/60">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span>Nashik Headquarters & Service Hub</span>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Nashik+Maharashtra"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute right-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-brand-primary shadow-md backdrop-blur-sm border border-slate-200/60 hover:bg-white hover:text-amber-600 transition"
                >
                  Open in Maps ↗
                </a>

                <div className="border-t border-slate-200/80 bg-white p-3.5 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 text-sm">📍</span>
                      <span className="text-xs font-bold text-slate-800">
                        Active Installations Across Nashik District
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Gangapur Rd · Nashik Rd · Indira Nagar · Satpur · Ambad · Sinnar
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {submitted && submittedInfo ? (
              <div className="flex min-h-[460px] flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-[0_20px_50px_rgba(16,185,129,.1)] transition-all">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 shadow-inner">
                  <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  ✓ Enquiry Sent Successfully
                </span>

                <h3 className="mt-4 text-2xl font-bold tracking-tight text-brand-primary sm:text-3xl">
                  Thank You, {submittedInfo.name}!
                </h3>

                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                  Your solar quote request for <strong className="text-slate-800">{submittedInfo.location || "Nashik"}</strong> has been received by the Navtej Solar team. Our senior engineer will prepare a customized proposal and get in touch with you shortly.
                </p>

                <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row justify-center">
                  <a
                    href={`tel:+${ownerPhone}`}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-bold text-white shadow-lg shadow-brand-primary/20 transition hover:-translate-y-0.5 hover:bg-brand-primary-hover"
                  >
                    <span>📞 Call Owner Now</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmittedInfo(null);
                    }}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Submit Another Quote
                  </button>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-slate-400">
                  <span>✓ Free Rooftop Survey</span>
                  <span>&bull;</span>
                  <span>✓ Official PM Surya Ghar Subsidy</span>
                  <span>&bull;</span>
                  <span>✓ 25-Yr Panel Warranty</span>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-[0_16px_45px_rgba(11,37,90,.08)] sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-xs font-bold text-brand-primary sm:col-span-2">
                    Full name
                    <input
                      required
                      name="name"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                      placeholder="e.g. Ramesh Patel"
                    />
                  </label>
                  <label className="text-xs font-bold text-brand-primary">
                    Phone number
                    <input
                      required
                      type="tel"
                      name="phone"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                      placeholder="+91 94032 77273"
                    />
                  </label>
                  <label className="text-xs font-bold text-brand-primary">
                    Location
                    <input
                      required
                      name="location"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                      placeholder="e.g. Gangapur Road, Nashik"
                    />
                  </label>
                  <label className="text-xs font-bold text-brand-primary">
                    Plot / roof size
                    <input
                      name="plot-size"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                      placeholder="e.g. 1200 sq ft"
                    />
                  </label>
                  <label className="text-xs font-bold text-brand-primary">
                    Monthly electricity bill
                    <input
                      name="bill"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                      placeholder="e.g. ₹3,500"
                    />
                  </label>
                </div>

                {errorMessage && (
                  <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand-primary/20 transition hover:-translate-y-0.5 hover:bg-brand-primary-hover disabled:opacity-60 disabled:pointer-events-none"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting quote request...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Free Quote</span>
                      <span className="text-base">→</span>
                    </>
                  )}
                </button>
                <p className="mt-4 text-center text-[11px] text-slate-400">Direct enquiry to verified Navtej Solar team (+91 94032 77273).</p>
              </form>
            )}
          </div>
        </Container>
      </section>
      {/* Customer Rating & Review Modal */}
      {reviewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 id="review-modal-title" className="text-xl font-bold text-brand-primary">
                  Rate Navtej Solar
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Share your experience with our offline installation, service, or website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                aria-label="Close dialog"
                className="rounded-full p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl mb-4">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-brand-primary">Thank you for your rating!</h4>
                <p className="mt-2 text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Your feedback has been published and helps families across Nashik choose dependable solar energy.
                </p>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="mt-6 rounded-full bg-brand-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-primary-hover transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="mt-5 grid gap-4">
                {/* Star rating selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-primary mb-1.5">
                    Your Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = (reviewHoverRating || reviewRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setReviewHoverRating(star)}
                          onMouseLeave={() => setReviewHoverRating(0)}
                          onClick={() => setReviewRating(star)}
                          className="text-3xl text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                          title={`${star} Star${star > 1 ? "s" : ""}`}
                        >
                          {filled ? "★" : "☆"}
                        </button>
                      );
                    })}
                    <span className="ml-2 text-xs font-bold text-amber-700">
                      {reviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Service used */}
                <div>
                  <label htmlFor="rev-service" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Service Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="rev-service"
                    value={reviewServiceType}
                    onChange={(e) => setReviewServiceType(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  >
                    <option value="Rooftop Solar Installation (Offline)">Offline Rooftop Solar Installation</option>
                    <option value="Commercial Solar Project (Offline)">Commercial / Industrial Solar Array (Offline)</option>
                    <option value="Maintenance & Support (Offline)">Solar Cleaning, Maintenance & Support (Offline)</option>
                    <option value="Website & Solar Calculator (Online)">Website & Solar Calculator Consultation</option>
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="rev-name" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="rev-name"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Anand Kulkarni"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="rev-location" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Location in Nashik <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="rev-location"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    placeholder="e.g. Gangapur Road, Nashik"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  />
                </div>

                {/* Quote / Review */}
                <div>
                  <label htmlFor="rev-quote" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Your Review &amp; Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="rev-quote"
                    required
                    rows={3}
                    value={reviewQuote}
                    onChange={(e) => setReviewQuote(e.target.value)}
                    placeholder="How was the installation quality, subsidy assistance, or website solar estimate? What was your experience?"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  />
                </div>

                {reviewError && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700">
                    {reviewError}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    disabled={reviewSubmitting}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2 text-xs font-bold text-white hover:bg-brand-primary-hover disabled:opacity-60 transition"
                  >
                    {reviewSubmitting ? "Submitting Review..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
