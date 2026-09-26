"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { calculateSolar, type SolarCalculation } from "@/lib/calculator/calculate";
import { solarCalculatorConfig } from "@/lib/calculator/config";

function formatInr(val: number): string {
  return `₹${Math.round(val).toLocaleString("en-IN")}`;
}

function formatNum(val: number): string {
  return Number(val.toFixed(2)).toLocaleString("en-IN");
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/[.08] p-5">
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
      {detail && <p className="mt-1 text-xs text-white/50">{detail}</p>}
    </article>
  );
}

export default function CalculatorPage() {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [systemSize, setSystemSize] = useState(3);
  const [result, setResult] = useState<SolarCalculation>(() => calculateSolar(3));
  const [error, setError] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [submittedLeadInfo, setSubmittedLeadInfo] = useState<{ name: string; location: string } | null>(null);
  const [pending, setPending] = useState(false);
  const leadFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch {
        // middleware handles route redirection
      }
    }
    checkAuth();
  }, []);

  function calculate(event?: FormEvent<HTMLFormElement>) {
    if (event) event.preventDefault();
    try {
      setResult(calculateSolar(systemSize));
      setError("");
      setLeadStatus("");
    } catch (calculationError) {
      setError(calculationError instanceof Error ? calculationError.message : "Choose a valid system size.");
    }
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result) return;
    const form = leadFormRef.current ?? event.currentTarget;
    if (!form) return;

    setPending(true);
    setLeadStatus("");

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const name = String(payload.name || "").trim();
    const location = String(payload.location || "").trim();

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          location,
          message: `Solar estimate calculation for ${result.systemSizeKw} kW package. Estimated cost: ₹${result.estimatedCostInr.toLocaleString("en-IN")}, Annual savings: ₹${result.annualSavingInr.toLocaleString("en-IN")}.`,
          calculatorResult: result,
          systemSizeKw: result.systemSizeKw,
        }),
      });

      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "We could not send your request.");

      setSubmittedLeadInfo({ name, location });
      setLeadStatus("Thanks! Your estimate has been recorded.");
      leadFormRef.current?.reset();
    } catch (submitError) {
      setLeadStatus(submitError instanceof Error ? submitError.message : "We could not send your request.");
    } finally {
      setPending(false);
    }
  }

  const ownerPhone = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "919403277273";
  const whatsappText = result
    ? `Hello Navtej Solartech Energy, I am interested in a ${result.systemSizeKw} kW system. Estimated cost: ${formatInr(
        result.estimatedCostInr
      )}, annual savings: ${formatInr(result.annualSavingInr)}, payback: ${formatNum(
        result.paybackYears
      )} years.`
    : "Hello Navtej Solartech Energy, I would like a solar estimate.";

  return (
    <>
      <Navbar />
      <main className="bg-background">
        <section className="border-b border-border bg-white py-16 sm:py-24">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">
                  Solar Investment & Savings Calculator
                </p>
                <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] text-brand-primary sm:text-6xl">
                  Choose a system size. See the numbers clearly.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                  Select a package from 1 to 20 kW to calculate cost, daily generation, annual savings, roof area, and
                  payback period.
                </p>
              </div>
              {currentUser && (
                <div className="shrink-0 self-start sm:self-auto rounded-2xl bg-brand-primary/5 border border-brand-primary/15 px-4 py-3 text-xs">
                  <p className="text-text-secondary">Logged in as:</p>
                  <p className="font-bold text-brand-primary">{currentUser?.name || currentUser?.email || "User"}</p>
                  <p className="text-text-secondary">{currentUser?.email || ""}</p>
                </div>
              )}
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
              <form onSubmit={calculate} className="rounded-3xl bg-white p-6 shadow-[0_16px_45px_rgba(11,37,90,.08)] sm:p-8">
                <h2 className="text-2xl font-semibold text-brand-primary">Select your package</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Choose from tested residential & commercial solar capacities from 1 kW up to 20 kW.
                </p>

                <label className="mt-7 block text-sm font-bold text-brand-primary">
                  System size
                  <select
                    value={systemSize}
                    onChange={(event) => {
                      const val = Number(event.target.value);
                      setSystemSize(val);
                      try {
                        setResult(calculateSolar(val));
                      } catch {
                        // ignore
                      }
                    }}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 font-normal outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                  >
                    {solarCalculatorConfig.packages.map((item) => (
                      <option key={item.systemSizeKw} value={item.systemSizeKw}>
                        {item.systemSizeKw} kW System
                      </option>
                    ))}
                  </select>
                </label>

                {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

                <button
                  type="submit"
                  className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-primary px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(11,37,90,.18)] transition hover:-translate-y-0.5 hover:bg-brand-primary-hover"
                >
                  Recalculate estimate <span className="ml-2">↗</span>
                </button>

                <p className="mt-4 text-xs leading-5 text-text-secondary">
                  Calculations are based on Nashik solar irradiance data and high-efficiency mono PERC panels.
                </p>
              </form>

              <section aria-live="polite" className="rounded-3xl bg-brand-primary p-6 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">
                  Your estimated results
                </p>

                {result ? (
                  <>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h2 className="text-3xl font-semibold">{result.systemSizeKw} kW solar package</h2>
                        <p className="mt-2 text-sm text-white/60">
                          {result.panelCount} x {solarCalculatorConfig.assumptions.panelRatingW} W panels ·{" "}
                          {result.inverterCapacityKw} kW inverter
                        </p>
                      </div>
                      <a
                        href={`https://wa.me/${ownerPhone}?text=${encodeURIComponent(whatsappText)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#25D366] px-5 text-sm font-bold text-white hover:bg-[#20b858] transition"
                      >
                        💬 Chat with Owner on WhatsApp
                      </a>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <Metric label="Estimated system cost" value={formatInr(result.estimatedCostInr)} />
                      <Metric label="Required roof area" value={`${formatNum(result.roofAreaSqFt)} sq ft`} />
                      <Metric label="Daily generation" value={`${formatNum(result.dailyGenerationKwh)} kWh`} />
                      <Metric label="Monthly generation" value={`${formatNum(result.monthlyGenerationKwh)} kWh`} />
                      <Metric label="Yearly generation" value={`${formatNum(result.yearlyGenerationKwh)} kWh`} />
                      <Metric label="Annual electricity savings" value={formatInr(result.annualSavingInr)} />
                      <Metric label="Payback period" value={`${formatNum(result.paybackYears)} years`} />
                      <Metric label="CO₂ reduction" value={`${formatNum(result.co2ReductionTonnesPerYear)} tonnes/yr`} />
                    </div>

                    <div className="mt-8 rounded-3xl bg-white p-6 sm:p-8 text-brand-primary shadow-xl">
                      {submittedLeadInfo ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 shadow-inner">
                            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>

                          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                            ✓ Proposal Request Recorded
                          </span>

                          <h3 className="mt-3 text-2xl font-bold text-brand-primary">
                            Thank You, {submittedLeadInfo.name}!
                          </h3>

                          <p className="mt-2 max-w-md text-sm text-text-secondary leading-relaxed">
                            Your <strong className="text-brand-primary">{result.systemSizeKw} kW</strong> rooftop solar calculation for <strong className="text-brand-primary">{submittedLeadInfo.location}</strong> has been sent to our engineering team. We will review subsidy eligibility and contact you shortly.
                          </p>

                          <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <a
                              href={`tel:+${ownerPhone}`}
                              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-primary px-5 text-xs font-bold text-white shadow hover:bg-brand-primary-hover"
                            >
                              📞 Call Owner (+91 94032 77273)
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setSubmittedLeadInfo(null);
                                setLeadStatus("");
                              }}
                              className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              Submit Another Request
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-semibold">Request a verified site proposal</h3>
                          <p className="mt-1 text-sm text-text-secondary">
                            Submit this calculation to our local team for rooftop inspection and accurate PM Surya Ghar subsidy processing.
                          </p>

                          <form ref={leadFormRef} onSubmit={submitLead} className="mt-5 grid gap-4 sm:grid-cols-2">
                            <input
                              required
                              name="name"
                              defaultValue={currentUser?.name || ""}
                              placeholder="Full name"
                              className="rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                            />
                            <input
                              required
                              name="phone"
                              defaultValue={currentUser?.phone || ""}
                              placeholder="Phone number"
                              pattern="[0-9+() -]{10,20}"
                              className="rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                            />
                            <input
                              name="email"
                              type="email"
                              defaultValue={currentUser?.email || ""}
                              placeholder="Email (optional)"
                              className="rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                            />
                            <input
                              required
                              name="location"
                              placeholder="Area / Location in Nashik"
                              className="rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                            />
                            <select
                              name="contactMethod"
                              defaultValue="whatsapp"
                              className="rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary"
                            >
                              <option value="whatsapp">Preferred contact: WhatsApp</option>
                              <option value="phone">Preferred contact: Phone</option>
                              <option value="email">Preferred contact: Email</option>
                            </select>

                            <button
                              disabled={pending}
                              className="flex items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-brand-primary-hover disabled:opacity-60 disabled:pointer-events-none"
                            >
                              {pending ? (
                                <>
                                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Submitting proposal request...</span>
                                </>
                              ) : (
                                <>
                                  <span>Request Free Rooftop Proposal</span>
                                  <span>→</span>
                                </>
                              )}
                            </button>
                          </form>

                          {leadStatus && (
                            <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 text-xs font-semibold text-green-900">
                              <p>{leadStatus}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="mt-16 max-w-sm">
                    <p className="text-2xl font-semibold">Your numbers will appear here.</p>
                    <p className="mt-4 leading-7 text-white/65">
                      Choose a system package on the left to see its exact generation, cost, and savings metrics.
                    </p>
                    <div className="mt-10 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-2/3 rounded-full bg-brand-secondary" />
                    </div>
                  </div>
                )}
              </section>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
