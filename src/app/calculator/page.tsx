"use client";

import { FormEvent, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function CalculatorPage() {
  const [bill, setBill] = useState(5000);
  const [roofSize, setRoofSize] = useState(800);
  const [location, setLocation] = useState("Nashik");
  const [result, setResult] = useState<null | { size: number; cost: number; savings: number; payback: number; subsidy: number }>(null);
  const [error, setError] = useState("");

  async function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { data: { user } } = await createSupabaseBrowserClient().auth.getUser();
    if (!user) {
      window.location.href = "/login?next=/calculator";
      return;
    }
    if (bill < 1000 || bill > 100000 || roofSize < 100 || roofSize > 100000 || !location.trim()) {
      setError("Enter a valid monthly bill, roof size and location to continue.");
      setResult(null);
      return;
    }
    setError("");
    const size = Math.max(1, Math.min(100, Math.round((bill / 850) * 10) / 10));
    const cost = Math.round(size * 62000);
    const subsidy = Math.min(78000, Math.round(size * 18000));
    const savings = Math.round(Math.min(bill * 0.9, size * 850));
    setResult({ size, cost, savings, subsidy, payback: Math.max(2, Math.round(((cost - subsidy) / (savings * 12)) * 10) / 10) });
  }

  const whatsappText = result ? `Hello Navtej Solartech Energy, I calculated a ${result.size} kW solar system for my ${location} property. Please help me with a free site visit.` : "Hello Navtej Solartech Energy, I would like a solar estimate.";

  return (
    <><Navbar /><main className="bg-background"><section className="border-b border-border bg-white py-16 sm:py-24"><Container><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Plan your switch</p><h1 className="mt-4 text-5xl font-semibold leading-[1.05] text-brand-primary sm:text-6xl">See what your rooftop can save.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">Use this estimate to understand the right system size, investment and payback for your home or business in Nashik.</p></div></Container></section><section className="py-12 sm:py-20"><Container><div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start"><form onSubmit={calculate} className="rounded-3xl bg-white p-6 shadow-[0_16px_45px_rgba(11,37,90,.08)] sm:p-8"><h2 className="text-2xl font-semibold text-brand-primary">Your energy profile</h2><div className="mt-7 grid gap-5"><label className="text-sm font-bold text-brand-primary">Monthly electricity bill (INR)<input required type="number" min="1000" max="100000" value={bill} onChange={(event) => setBill(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10" /></label><label className="text-sm font-bold text-brand-primary">Usable roof or plot size (sq ft)<input required type="number" min="100" max="100000" value={roofSize} onChange={(event) => setRoofSize(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10" /></label><label className="text-sm font-bold text-brand-primary">Location<input required value={location} onChange={(event) => setLocation(event.target.value)} className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10" placeholder="Nashik" /></label></div>{error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<button type="submit" className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-primary px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(11,37,90,.18)] transition hover:-translate-y-0.5 hover:bg-brand-primary-hover">Calculate my estimate <span className="ml-2">↗</span></button><p className="mt-4 text-xs leading-5 text-text-secondary">Estimates use typical Nashik irradiation and current indicative pricing. Your site survey determines the final design.</p></form><div className="rounded-3xl bg-brand-primary p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">Your estimate</p>{result ? <><h2 className="mt-4 text-3xl font-semibold">A clearer path to lower bills.</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{[["System size", `${result.size} kW`], ["Estimated investment", `INR ${result.cost.toLocaleString("en-IN")}`], ["Monthly savings", `INR ${result.savings.toLocaleString("en-IN")}`], ["Estimated payback", `${result.payback} years`], ["Subsidy estimate", `INR ${result.subsidy.toLocaleString("en-IN")}`]].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/15 bg-white/[.08] p-5"><p className="text-xs text-white/60">{label}</p><p className="mt-2 text-xl font-bold text-white">{value}</p></div>)}</div><a href={`https://wa.me/919876543210?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-sm font-bold text-white transition hover:bg-[#1da851]">Discuss this on WhatsApp</a></> : <div className="mt-16 max-w-sm"><p className="text-2xl font-semibold">Your numbers will appear here.</p><p className="mt-4 leading-7 text-white/65">Enter your bill and available roof space for a quick, useful starting point before your free site visit.</p><div className="mt-10 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-brand-secondary" /></div></div>}</div></div></Container></section></main></>
  );
}
