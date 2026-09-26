"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { OwnerHeader } from "@/components/owner/OwnerHeader";

interface VisitRecord {
  _id: string;
  visitorId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userRole?: string;
  ip: string;
  userAgent: string;
  path: string;
  referrer?: string;
  createdAt: string;
}

export default function OwnerVisitsPage() {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadVisits() {
    try {
      setLoading(true);
      const res = await fetch("/api/visits");
      if (res.ok) {
        const data = await res.json();
        setVisits(data);
      }
    } catch (err) {
      console.error("Failed to load visits", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisits();
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-background py-10 sm:py-16">
        <Container>
          <OwnerHeader
            title="Website Visitor Log"
            description="Live visitor notifications and user details logged into MongoDB upon every visit."
          />

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8 overflow-hidden">
            <h2 className="text-xl font-semibold text-brand-primary">Recent Visitors ({visits.length})</h2>

            {loading ? (
              <p className="mt-6 text-sm text-slate-500">Loading visit records from MongoDB...</p>
            ) : visits.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">No visits recorded yet.</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3 px-4">Visitor / User</th>
                      <th className="py-3 px-4">Email / Phone</th>
                      <th className="py-3 px-4">Page Visited</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visits.map((v) => (
                      <tr key={v._id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-semibold text-brand-primary">
                          {v.userName || "Guest Visitor"}
                          {v.userRole === "owner" && (
                            <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                              Admin
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {v.userEmail || v.userPhone ? (
                            <div>
                              <div>{v.userEmail || "—"}</div>
                              <div className="text-xs text-slate-400">{v.userPhone || ""}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400">Unauthenticated</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-mono text-brand-primary">
                            {v.path}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-500">{v.ip}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">
                          {new Date(v.createdAt).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Container>
      </main>
    </>
  );
}
