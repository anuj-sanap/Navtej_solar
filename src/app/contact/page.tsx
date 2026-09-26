"use client";

import { FormEvent, useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState<{ name: string; location: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current ?? event.currentTarget;
    if (!form) return;

    setStatus("loading");
    setMessage("");

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const name = String(payload.name || "").trim();
    const location = String(payload.location || "").trim();

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to send your enquiry.");

      setSubmittedData({ name, location });
      setStatus("success");
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please call us directly.");
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-background">
        <section className="bg-white py-16 sm:py-24">
          <Container>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Start a conversation</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] text-brand-primary sm:text-6xl">
              Let&apos;s make your energy bill lighter.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
              Tell us what you are planning and we will come back with a clear next step, not a hard sell.
            </p>
          </Container>
        </section>

        <section className="py-12 sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
              <div>
                <h2 className="text-3xl font-semibold text-brand-primary">Talk to Navtej</h2>
                <div className="mt-8 grid gap-6 text-sm">
                  {[
                    ["Call", "+91 94032 77273", "tel:+919403277273"],
                    ["WhatsApp", "+91 94032 77273", "https://wa.me/919403277273"],
                    ["Email", "hello@navtejsolartech.in", "mailto:hello@navtejsolartech.in"],
                  ].map(([label, value, href]) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                      <span className="block text-xs font-bold uppercase tracking-[.14em] text-[#b07d00]">
                        {label}
                      </span>
                      <span className="mt-2 block font-bold text-brand-primary">{value}</span>
                    </a>
                  ))}
                  <div className="rounded-2xl bg-brand-primary p-5 text-white">
                    <span className="block text-xs font-bold uppercase tracking-[.14em] text-brand-secondary">
                      Service locations
                    </span>
                    <span className="mt-2 block font-bold">Nashik, Sinnar, Ozar and nearby regions</span>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                    <div className="relative h-52 w-full">
                      <iframe
                        title="Navtej Solar Nashik Service Area Map"
                        src="https://maps.google.com/maps?q=Nashik,%20Maharashtra,%20India&t=&z=12&ie=UTF8&iwloc=&output=embed"
                        className="h-full w-full border-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2.5 text-xs">
                      <span className="font-semibold text-slate-700">📍 Nashik, Maharashtra</span>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Nashik+Maharashtra"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#b07d00] hover:underline"
                      >
                        Open in Google Maps ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {status === "success" && submittedData ? (
                <div className="flex min-h-[460px] flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-[0_20px_50px_rgba(16,185,129,.1)] transition-all">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 shadow-inner">
                    <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    ✓ Request Received
                  </span>

                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-brand-primary sm:text-3xl">
                    Thank You, {submittedData.name}!
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                    Your inquiry for <strong className="text-slate-800">{submittedData.location || "Nashik"}</strong> has been delivered directly to the Navtej Solar team. An engineer will review your site requirements and contact you within 2 hours.
                  </p>

                  <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row justify-center">
                    <a
                      href="tel:+919403277273"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-bold text-white shadow-lg shadow-brand-primary/20 transition hover:-translate-y-0.5 hover:bg-brand-primary-hover"
                    >
                      <span>📞 Call Owner (+91 94032 77273)</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus("idle");
                        setSubmittedData(null);
                      }}
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={submit}
                  className="rounded-3xl bg-white p-6 shadow-[0_16px_45px_rgba(11,37,90,.08)] sm:p-8"
                >
                  <h2 className="text-2xl font-semibold text-brand-primary">Request a free quote</h2>
                  <p className="mt-2 text-sm text-text-secondary">
                    Direct enquiry to our Nashik engineering team for custom rooftop solar sizing and subsidy advice.
                  </p>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-bold text-brand-primary">
                      Full name
                      <input
                        name="name"
                        required
                        placeholder="e.g. Ramesh Patel"
                        className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                      />
                    </label>
                    <label className="text-sm font-bold text-brand-primary">
                      Phone number
                      <input
                        name="phone"
                        required
                        type="tel"
                        pattern="[0-9+() -]{10,}"
                        placeholder="e.g. +91 94032 77273"
                        className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                      />
                    </label>
                    <label className="text-sm font-bold text-brand-primary">
                      Email (optional)
                      <input
                        name="email"
                        type="email"
                        placeholder="ramesh@example.com"
                        className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                      />
                    </label>
                    <label className="text-sm font-bold text-brand-primary">
                      Location
                      <input
                        name="location"
                        required
                        className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                        placeholder="e.g. Gangapur Road, Nashik"
                      />
                    </label>
                    <label className="text-sm font-bold text-brand-primary sm:col-span-2">
                      How can we help?
                      <textarea
                        name="message"
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                        placeholder="Tell us about your home, monthly bill, or requirements"
                      />
                    </label>
                  </div>

                  {status === "error" && message && (
                    <div
                      role="alert"
                      className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700"
                    >
                      <p>{message}</p>
                    </div>
                  )}

                  <button
                    disabled={status === "loading"}
                    className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand-primary/20 transition hover:-translate-y-0.5 hover:bg-brand-primary-hover disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting enquiry...</span>
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
      </main>
    </>
  );
}
