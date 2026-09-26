"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface OwnerHeaderProps {
  title: string;
  description: string;
}

export function OwnerHeader({ title, description }: OwnerHeaderProps) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Completed Projects",
      href: "/owner/projects",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: "Customer Testimonials",
      href: "/owner/testimonials",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: "Visitor Logs",
      href: "/owner/visits",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="border-b border-border pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#b07d00] border border-amber-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b07d00] animate-pulse" />
            Admin Workspace
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-brand-primary">{title}</h1>
          <p className="mt-2 text-sm text-text-secondary max-w-2xl">{description}</p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-xs font-bold text-brand-primary hover:bg-slate-50 transition"
          >
            <span>Live Site</span>
            <span className="text-slate-400">↗</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <nav className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-px" aria-label="Admin tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs font-bold transition border-b-2 -mb-px ${
                isActive
                  ? "border-brand-primary text-brand-primary bg-white shadow-sm"
                  : "border-transparent text-slate-500 hover:text-brand-primary hover:border-slate-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
