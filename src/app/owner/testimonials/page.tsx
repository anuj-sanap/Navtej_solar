"use client";

import { FormEvent, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { OwnerHeader } from "@/components/owner/OwnerHeader";

interface TestimonialItem {
  id: string;
  _id?: string;
  name: string;
  quote: string;
  location?: string;
  rating?: number;
  serviceType?: string;
  source?: "admin" | "customer";
  createdAt?: string;
}

export default function OwnerTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Add form state
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [serviceType, setServiceType] = useState("Offline Solar Installation");
  const [addPending, setAddPending] = useState(false);
  const [addStatus, setAddStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<TestimonialItem | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function loadTestimonials() {
    try {
      setLoading(true);
      setFetchError("");
      const res = await fetch("/api/testimonials", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load testimonials.");
      }
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function handleAddSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) {
      setAddStatus({ type: "error", message: "Customer name and quote/feedback are required." });
      return;
    }

    setAddPending(true);
    setAddStatus(null);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          quote: quote.trim(),
          location: location.trim(),
          rating,
          serviceType,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setAddStatus({ type: "error", message: result.error || "Failed to add testimonial." });
        setAddPending(false);
        return;
      }

      setName("");
      setQuote("");
      setLocation("");
      setRating(5);
      setAddStatus({ type: "success", message: "Customer feedback added successfully!" });
      loadTestimonials();
    } catch {
      setAddStatus({ type: "error", message: "Network error saving feedback." });
    } finally {
      setAddPending(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingItem) return;
    setDeletePending(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/testimonials/${deletingItem.id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) {
        setDeleteError(result.error || "Could not delete testimonial.");
        setDeletePending(false);
        return;
      }

      setDeletingItem(null);
      loadTestimonials();
    } catch {
      setDeleteError("Network error deleting testimonial.");
    } finally {
      setDeletePending(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen py-10 sm:py-16">
        <Container>
          <OwnerHeader
            title="Customer Testimonials"
            description="Manage client feedback and reviews displayed on the website homepage."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
            {/* Add Testimonial Form */}
            <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 border border-border">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-semibold text-brand-primary">Add Customer Review</h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    Required: Customer name and feedback quote. Location is optional.
                  </p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                  New Review
                </span>
              </div>

              <form onSubmit={handleAddSubmit} className="mt-6 grid gap-4">
                <div>
                  <label htmlFor="test-name" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="test-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="test-loc" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                      Location <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="test-loc"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Gangapur Road, Nashik"
                      className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="test-rating" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                      Rating
                    </label>
                    <select
                      id="test-rating"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                    >
                      <option value={5}>★★★★★ (5 Stars)</option>
                      <option value={4}>★★★★☆ (4 Stars)</option>
                      <option value={3}>★★★☆☆ (3 Stars)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="test-service" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Service Experience Type
                  </label>
                  <select
                    id="test-service"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  >
                    <option value="Offline Solar Installation">Offline Rooftop Solar Installation</option>
                    <option value="Commercial Solar Project">Commercial / Industrial Solar Array</option>
                    <option value="Solar Maintenance & Service">Solar Cleaning, Maintenance & Support (Offline)</option>
                    <option value="Website & Solar Calculator">Website & Solar Calculator Consultation</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="test-quote" className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Customer Quote / Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="test-quote"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    required
                    rows={4}
                    placeholder="e.g. Navtej Solar installed our 5 kW rooftop system ahead of schedule. Subsidy documentation was smooth and power bills dropped by 80%."
                    className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition"
                  />
                </div>

                {addStatus && (
                  <div
                    role="alert"
                    className={`rounded-xl px-4 py-3 text-xs font-semibold ${
                      addStatus.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {addStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={addPending}
                  className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 text-sm font-bold text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
                >
                  {addPending ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving Feedback...</span>
                    </>
                  ) : (
                    <span>Add Customer Testimonial</span>
                  )}
                </button>
              </form>
            </section>

            {/* Testimonials List */}
            <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 border border-border">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-semibold text-brand-primary">Live Testimonials</h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    {testimonials.length} review{testimonials.length === 1 ? "" : "s"} shown on homepage
                  </p>
                </div>
                <button
                  onClick={loadTestimonials}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  title="Refresh list"
                >
                  ↻ Refresh
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
                  <p className="mt-3">Loading testimonials from database...</p>
                </div>
              ) : fetchError ? (
                <div className="py-8 text-center">
                  <p className="text-xs font-semibold text-red-600">{fetchError}</p>
                  <button
                    onClick={loadTestimonials}
                    className="mt-3 rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-primary-hover"
                  >
                    Try Again
                  </button>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-600">No testimonials yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Add customer feedback using the form to have it appear on the homepage.
                  </p>
                </div>
              ) : (
                <div className="mt-6 divide-y divide-slate-100 max-h-[700px] overflow-y-auto pr-1">
                  {testimonials.map((t) => (
                    <article key={t.id} className="py-4.5 group">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-amber-500 text-sm tracking-widest">
                            {"★".repeat(t.rating || 5)}
                            {"☆".repeat(5 - (t.rating || 5))}
                          </div>
                          <h3 className="font-bold text-brand-primary text-sm mt-1">{t.name}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              t.source === "admin"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-emerald-100 text-emerald-900"
                            }`}>
                              {t.source === "admin" ? "Admin Added" : "Customer Rating"}
                            </span>
                            {t.serviceType && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700">
                                {t.serviceType}
                              </span>
                            )}
                            {t.location && (
                              <span className="text-text-secondary">📍 {t.location}</span>
                            )}
                          </div>
                        </div>

                        {/* If it's a MongoDB record with a real ID (not default fallback ID), allow deletion */}
                        <button
                          type="button"
                          onClick={() => setDeletingItem(t)}
                          className="shrink-0 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100/60 transition"
                        >
                          🗑 Delete
                        </button>
                      </div>

                      <blockquote className="mt-2.5 text-xs text-slate-600 leading-relaxed italic border-l-2 border-brand-primary/20 pl-3">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </Container>
      </main>

      {/* DELETE TESTIMONIAL CONFIRMATION MODAL */}
      {deletingItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-testimonial-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 id="delete-testimonial-title" className="text-lg font-bold text-brand-primary">
              Delete Testimonial
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete feedback from{" "}
              <strong className="text-brand-primary font-semibold">&ldquo;{deletingItem.name}&rdquo;</strong>?
              This will remove the review from the public website.
            </p>

            {deleteError && (
              <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={deletePending}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deletePending}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60 transition"
              >
                {deletePending ? "Deleting..." : "Delete Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
