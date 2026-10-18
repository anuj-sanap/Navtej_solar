"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { calculateSolar, getRecommendedSystemSize, type SolarCalculation } from "@/lib/calculator/calculate";
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

const BILL_PRESETS = [1500, 3000, 5000, 8000, 12000, 20000];

export default function CalculatorPage() {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [monthlyBill, setMonthlyBill] = useState<number>(3500);
  const [systemSize, setSystemSize] = useState<number>(() => getRecommendedSystemSize(3500));
  const [result, setResult] = useState<SolarCalculation>(() => calculateSolar(getRecommendedSystemSize(3500), 3500));
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

  function handleBillChange(newBill: number, autoAdjustSize = true) {
    const validBill = Math.max(0, newBill);
    setMonthlyBill(validBill);
    setError("");

    if (autoAdjustSize && validBill > 0) {
      const recommended = getRecommendedSystemSize(validBill);
      setSystemSize(recommended);
      try {
        setResult(calculateSolar(recommended, validBill));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error calculating solar estimate.");
      }
    } else {
      try {
        setResult(calculateSolar(systemSize, validBill));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error calculating solar estimate.");
      }
    }
  }

  function handleSystemSizeChange(newSize: number) {
    setSystemSize(newSize);
    setError("");
    try {
      setResult(calculateSolar(newSize, monthlyBill));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Choose a valid system size.");
    }
  }

  function calculate(event?: FormEvent<HTMLFormElement>) {
    if (event) event.preventDefault();
    try {
      setResult(calculateSolar(systemSize, monthlyBill));
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
          electricityBill: monthlyBill,
          systemSizeKw: result.systemSizeKw,
          message: `Solar estimate calculation for monthly bill of ₹${monthlyBill.toLocaleString("en-IN")} with a ${result.systemSizeKw} kW package. Estimated cost: ₹${result.estimatedCostInr.toLocaleString("en-IN")}, Annual savings: ₹${result.annualSavingInr.toLocaleString("en-IN")}, New bill: ~₹${(result.newMonthlyBillInr ?? 0).toLocaleString("en-IN")}/mo.`,
          calculatorResult: result,
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
    ? `Hello Navtej Solartech Energy, my monthly electricity bill is ${formatInr(monthlyBill)}. I am interested in a ${result.systemSizeKw} kW system. Estimated cost: ${formatInr(result.estimatedCostInr)}, annual savings: ${formatInr(result.annualSavingInr)}, estimated new bill: ${formatInr(result.newMonthlyBillInr ?? 0)}/mo (${result.billReductionPercent ?? 90}% bill cut), payback: ${formatNum(result.paybackYearsWithBill ?? result.paybackYears)} years.`
    : "Hello Navtej Solartech Energy, I would like a solar estimate.";

  const recommendedSize = getRecommendedSystemSize(monthlyBill);

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
                  Enter your bill. See your solar savings.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                  Provide your average monthly electricity bill to calculate the recommended rooftop system size,
                  monthly bill reduction, and payback timeline.
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
            <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
              {/* Input Form */}
              <form onSubmit={calculate} className="rounded-3xl bg-white p-6 shadow-[0_16px_45px_rgba(11,37,90,.08)] sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#b07d00] border border-amber-200/60 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b07d00]" />
                  Calculator Inputs
                </div>
                <h2 className="text-2xl font-semibold text-brand-primary">Electricity & Solar Details</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Adjust your monthly bill or pick a system capacity from 1 kW up to 20 kW.
                </p>

                {/* 1. Monthly Electricity Bill Input */}
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="monthlyBillInput" className="text-sm font-bold text-brand-primary">
                      Monthly Electricity Bill (₹)
                    </label>
                    <span className="text-xs font-semibold text-slate-500">
                      ~{Math.round(monthlyBill / (solarCalculatorConfig.assumptions.electricityTariffInrPerKwh || 8))} units/mo
                    </span>
                  </div>

                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-brand-primary">
                      ₹
                    </span>
                    <input
                      id="monthlyBillInput"
                      type="number"
                      min={0}
                      max={100000}
                      step={100}
                      value={monthlyBill || ""}
                      onChange={(e) => handleBillChange(Number(e.target.value) || 0, false)}
                      className="w-full rounded-xl border border-border bg-white pl-9 pr-4 py-3.5 text-lg font-bold text-brand-primary outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition"
                      placeholder="e.g. 3500"
                    />
                  </div>

                  {/* Slider */}
                  <div className="mt-4">
                    <input
                      type="range"
                      min={500}
                      max={25000}
                      step={250}
                      value={Math.min(25000, Math.max(500, monthlyBill))}
                      onChange={(e) => handleBillChange(Number(e.target.value), true)}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0b255a]"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>₹500</span>
                      <span>₹5,000</span>
                      <span>₹15,000</span>
                      <span>₹25,000+</span>
                    </div>
                  </div>

                  {/* Bill Presets */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Quick bill presets:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {BILL_PRESETS.map((preset) => {
                        const isSelected = monthlyBill === preset;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleBillChange(preset, true)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                              isSelected
                                ? "bg-brand-primary text-white shadow-sm"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            ₹{preset.toLocaleString("en-IN")}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommendation Tag */}
                  {monthlyBill > 0 && (
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-50/80 border border-amber-200/70 p-3">
                      <div>
                        <p className="text-xs font-semibold text-[#8b6300]">Recommended for this bill:</p>
                        <p className="text-sm font-bold text-brand-primary">{recommendedSize} kW Solar System</p>
                      </div>
                      {systemSize !== recommendedSize && (
                        <button
                          type="button"
                          onClick={() => handleSystemSizeChange(recommendedSize)}
                          className="rounded-full bg-brand-primary text-white px-3 py-1 text-xs font-bold hover:bg-brand-primary-hover shadow-sm"
                        >
                          Use {recommendedSize} kW
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. System Size Selector */}
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="systemSizeSelect" className="text-sm font-bold text-brand-primary">
                      Solar System Size (kW)
                    </label>
                    <span className="text-xs font-semibold text-slate-500">
                      {result?.dailyGenerationKwh} kWh / day
                    </span>
                  </div>

                  <select
                    id="systemSizeSelect"
                    value={systemSize}
                    onChange={(event) => handleSystemSizeChange(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-semibold text-brand-primary outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition"
                  >
                    {solarCalculatorConfig.packages.map((item) => (
                      <option key={item.systemSizeKw} value={item.systemSizeKw}>
                        {item.systemSizeKw} kW System · {item.panelCount} Panels · ~{item.monthlyGenerationKwh} kWh/mo
                      </option>
                    ))}
                  </select>
                </div>

                {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

                <button
                  type="submit"
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-primary px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(11,37,90,.18)] transition hover:-translate-y-0.5 hover:bg-brand-primary-hover"
                >
                  Recalculate Savings <span className="ml-2">↗</span>
                </button>

                <p className="mt-4 text-xs leading-5 text-text-secondary">
                  Assumptions: MSEDCL residential slab rate (~₹8/kWh), 4 units/kW/day average Nashik solar generation, and 550W Mono PERC solar panels.
                </p>
              </form>

              {/* Output Results */}
              <section aria-live="polite" className="rounded-3xl bg-brand-primary p-6 text-white sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">
                    Your estimated results
                  </p>
                  {result?.billReductionPercent !== undefined && result.billReductionPercent > 0 && (
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-bold text-emerald-300">
                      ⚡ Up to {result.billReductionPercent}% Bill Reduction
                    </span>
                  )}
                </div>

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
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#25D366] px-5 text-sm font-bold text-white hover:bg-[#20b858] transition shadow-lg shrink-0"
                      >
                        💬 Chat with Owner on WhatsApp
                      </a>
                    </div>

                    {/* Prominent Electricity Bill Impact Card */}
                    {monthlyBill > 0 && (
                      <div className="mt-6 rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-md">
                        <p className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
                          Monthly Electricity Bill Impact
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
                          <div className="rounded-xl bg-white/5 p-3">
                            <p className="text-[11px] text-white/60">Current Bill</p>
                            <p className="mt-1 text-lg font-bold text-white">{formatInr(monthlyBill)}</p>
                            <p className="text-[10px] text-white/40">/ month</p>
                          </div>

                          <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/30 p-3">
                            <p className="text-[11px] text-emerald-200">New Bill with Solar</p>
                            <p className="mt-1 text-lg font-bold text-emerald-300">
                              {formatInr(result.newMonthlyBillInr ?? 0)}
                            </p>
                            <p className="text-[10px] text-emerald-200/60">/ month</p>
                          </div>

                          <div className="rounded-xl bg-white/5 p-3">
                            <p className="text-[11px] text-white/60">Monthly Savings</p>
                            <p className="mt-1 text-lg font-bold text-[#ffd23f]">
                              {formatInr(result.solarMonthlySavingInr ?? result.annualSavingInr / 12)}
                            </p>
                            <p className="text-[10px] text-white/40">saved / mo</p>
                          </div>

                          <div className="rounded-xl bg-white/5 p-3">
                            <p className="text-[11px] text-white/60">Annual Savings</p>
                            <p className="mt-1 text-lg font-bold text-emerald-300">
                              {formatInr(result.annualBillSavingsInr ?? result.annualSavingInr)}
                            </p>
                            <p className="text-[10px] text-white/40">saved / yr</p>
                          </div>
                        </div>

                        {/* Progress Bar of Coverage */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-white/70 mb-1.5 font-medium">
                            <span>Solar Generation vs. Your Consumption</span>
                            <span className="font-bold text-[#ffd23f]">
                              {result.monthlyGenerationKwh} kWh produced / ~{Math.round(monthlyBill / 8)} kWh used
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#ffd23f] to-emerald-400 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, Math.round((result.monthlyGenerationKwh / Math.max(1, monthlyBill / 8)) * 100))}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Standard Package Metrics */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Metric label="Estimated system cost" value={formatInr(result.estimatedCostInr)} detail="Includes panels, inverter & structure" />
                      <Metric label="Required roof area" value={`${formatNum(result.roofAreaSqFt)} sq ft`} detail={`~${formatNum(result.roofAreaSqFt / 10.764)} sq meters shadow-free`} />
                      <Metric label="Daily generation" value={`${formatNum(result.dailyGenerationKwh)} kWh`} detail="Units produced per sunny day" />
                      <Metric label="Monthly generation" value={`${formatNum(result.monthlyGenerationKwh)} kWh`} detail="Average monthly energy output" />
                      <Metric label="Yearly generation" value={`${formatNum(result.yearlyGenerationKwh)} kWh`} detail="1,460 units generated per kW/year" />
                      <Metric label="Annual electricity savings" value={formatInr(result.annualSavingInr)} detail="Based on ₹8/unit utility tariff" />
                      <Metric
                        label="Payback period"
                        value={`${formatNum(result.paybackYearsWithBill ?? result.paybackYears)} years`}
                        detail="System pays for itself in savings"
                      />
                      <Metric label="CO₂ reduction" value={`${formatNum(result.co2ReductionTonnesPerYear)} tonnes/yr`} detail="Equivalent to planting ~45 trees/yr" />
                    </div>

                    {/* Proposal Request Form */}
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
                            Your <strong className="text-brand-primary">{result.systemSizeKw} kW</strong> rooftop solar calculation for <strong className="text-brand-primary">{submittedLeadInfo.location}</strong> with monthly bill of <strong className="text-brand-primary">₹{monthlyBill.toLocaleString("en-IN")}</strong> has been dispatched to our engineering team. We will contact you with subsidy details shortly.
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

                            {/* Pre-filled Monthly Bill in proposal */}
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Bill: ₹</span>
                              <input
                                name="electricityBill"
                                type="number"
                                value={monthlyBill}
                                onChange={(e) => setMonthlyBill(Number(e.target.value) || 0)}
                                placeholder="Monthly Bill"
                                className="w-full rounded-xl border border-border pl-14 pr-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                              />
                            </div>

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
                              className="sm:col-span-2 flex items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-3.5 text-sm font-bold text-white shadow transition hover:bg-brand-primary-hover disabled:opacity-60 disabled:pointer-events-none"
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
                                  <span>Request Free Rooftop Proposal for {result.systemSizeKw} kW</span>
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
                      Enter your monthly electricity bill on the left to see its exact generation, cost, and savings metrics.
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
