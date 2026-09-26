"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, menuBarItems, primaryCta, site } from "@/data/site";
import { Container } from "@/components/ui/Container";

function isActive(pathname: string, href: string) {
  if (href.includes("#")) {
    return false;
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface AuthUser {
  name: string;
  email: string;
  role: "user" | "owner";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Handle ESC key and lock body scroll while open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Fetch authenticated user
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      // ignore
    }
  }

  const ownerPhone = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "919403277273";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <Container className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-2.5 text-text-primary">
            <Image
              src="/navtej-logo.jpeg"
              alt={`${site.name} logo`}
              priority
              width={240}
              height={96}
              className="h-13 sm:h-15 w-auto object-contain"
            />
            <span className="hidden max-w-[10rem] text-sm font-bold leading-tight text-brand-primary sm:block lg:max-w-none lg:text-base">
              Navtej Solartech Energy
            </span>
          </Link>

          {/* Primary Navbar Links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
                    active
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Auth details & Menu Toggle Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Admin Portal link if owner */}
            {user?.role === "owner" && (
              <Link
                href="/owner/projects"
                className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-sm"
              >
                <span>🛡️ Admin Portal</span>
              </Link>
            )}

            {/* User greeting if logged in */}
            {user && (
              <span className="hidden text-xs font-semibold text-text-secondary xl:inline">
                Hi, <strong className="text-brand-primary">{(user.name || user.email).split(" ")[0]}</strong>
              </span>
            )}

            {/* Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="right-side-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                menuOpen
                  ? "bg-brand-primary text-white border border-brand-primary shadow-brand-primary/20"
                  : "bg-slate-100 text-brand-primary border border-slate-200 hover:bg-slate-200/80 hover:border-slate-300"
              }`}
            >
              <span className="relative flex h-3.5 w-4 flex-col justify-between">
                <span
                  className={`block h-0.5 w-4 rounded-full bg-current transition-all duration-200 ${
                    menuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-4 rounded-full bg-current transition-all duration-200 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-0.5 w-4 rounded-full bg-current transition-all duration-200 ${
                    menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
              <span>Menu</span>
            </button>
          </div>
        </Container>
      </header>

      {/* FULL-HEIGHT RIGHT-SIDE DRAWER (RENDERED AT ROOT BODY LEVEL, NOT TRAPPED INSIDE HEADER) */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Fullscreen Backdrop overlay */}
        <div
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Slide-out Drawer Panel (Takes true 100vh height and scrolls smoothly) */}
        <div
          id="right-side-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className={`fixed inset-y-0 right-0 z-[101] flex h-screen max-h-screen w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ height: "100vh", maxHeight: "100dvh" }}
        >
          {/* 1. DRAWER HEADER (Fixed at top) */}
          <div className="shrink-0 flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-white shadow-sm">
            <div className="flex items-center gap-2.5">
              <Image
                src="/navtej-logo.jpeg"
                alt={`${site.name} logo`}
                width={40}
                height={40}
                className="h-9 w-auto rounded-lg object-contain"
              />
              <div>
                <p className="text-sm font-bold text-brand-primary leading-tight">Navtej Solartech</p>
                <p className="text-[10px] text-text-secondary">Menu &amp; Quick Actions</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 2. SCROLLABLE BODY (flex-1 h-0 min-h-0 with overscroll-contain & touch scrolling) */}
          <div
            tabIndex={0}
            className="flex-1 h-0 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-6 focus:outline-none touch-pan-y"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#94a3b8 #f1f5f9",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* 1. GET FREE QUOTE (Prominently featured) */}
            <div>
              <Link
                href={primaryCta.href}
                onClick={() => setMenuOpen(false)}
                className="group flex flex-col rounded-2xl bg-gradient-to-r from-brand-primary via-[#0f2e6b] to-brand-primary p-4 text-white shadow-md shadow-brand-primary/15 transition hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ffd23f]">
                    Instant Site Survey
                  </span>
                  <span className="text-base text-brand-secondary transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <strong className="mt-1 text-lg font-bold">{primaryCta.label}</strong>
                <p className="mt-1 text-xs text-white/75">
                  Schedule a free survey in Nashik with subsidy guidance.
                </p>
              </Link>
            </div>

            {/* 2. FEATURED TOOLS (Calculator & About) */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Featured Tools &amp; Info
              </p>
              <div className="mt-2.5 grid gap-2">
                {menuBarItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  const isCalc = item.href === "/calculator";
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-start gap-3 rounded-2xl border p-3.5 transition ${
                        active
                          ? "border-brand-primary bg-blue-50/50"
                          : "border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-brand-primary font-bold text-lg">
                        {isCalc ? "⚡" : "ℹ️"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-brand-primary">
                            {item.label}
                          </span>
                          {isCalc && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                              Calculator
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5 leading-snug">
                          {item.subtitle}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 3. NAVIGATION LINKS */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Navigation
              </p>
              <nav className="mt-2.5 grid gap-1">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "bg-brand-primary text-white"
                          : "text-text-primary hover:bg-slate-100"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs opacity-60">→</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* 4. USER ACCOUNT & ADMIN PORTAL */}
            <div className="border-t border-slate-100 pt-5">
              {user ? (
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-[11px] text-text-secondary font-medium">Signed in as</p>
                  <p className="font-bold text-brand-primary text-sm truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>

                  {user.role === "owner" && (
                    <Link
                      href="/owner/projects"
                      onClick={() => setMenuOpen(false)}
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-bold text-[#b07d00] hover:bg-amber-100 transition"
                    >
                      <span>🛡️ Admin Portal</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2.5 w-full rounded-xl border border-red-200 bg-white py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-brand-primary px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-brand-primary-hover transition"
                >
                  Sign In / Register
                </Link>
              )}
            </div>

            {/* Extra padding at bottom so content is never hidden behind footer */}
            <div className="h-6" />
          </div>

          {/* 3. DRAWER FOOTER (Fixed at bottom) */}
          <div className="shrink-0 border-t border-slate-100 bg-slate-50 p-4 flex gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            <a
              href={`https://wa.me/${ownerPhone}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-bold text-white shadow hover:bg-[#20ba59] transition"
            >
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:+${ownerPhone}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-primary hover:bg-slate-100 transition"
            >
              Call Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
