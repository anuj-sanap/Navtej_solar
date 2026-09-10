"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, primaryCta, site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import logo from "@/assets/images/navtej-logo.jpeg";

function isActive(pathname: string, href: string) {
  if (href.includes("#")) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <Container className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 text-text-primary">
          <Image
            src={logo}
            alt={`${site.name} logo`}
            priority
            className="h-14 w-auto object-contain sm:h-16"
          />
          <span className="hidden max-w-[10rem] text-sm font-bold leading-tight text-brand-primary sm:block lg:max-w-none lg:text-base">
            Navtej Solartech Energy
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-white text-text-primary shadow-sm ring-1 ring-border/70"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-primary ring-1 ring-border"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="relative h-3.5 w-4">
            <span
              className={`absolute left-0 h-0.5 w-4 rounded-full bg-current transition-transform ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-4 rounded-full bg-current transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-4 rounded-full bg-current transition-transform ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </Container>

      <div
        id="mobile-navigation"
        className={`absolute right-5 top-full z-50 origin-top-right transition-all duration-200 sm:right-6 lg:right-8 ${open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"}`}
      >
        <div className="w-max max-w-[calc(100vw-2.5rem)] rounded-b-2xl rounded-t-2xl border border-border bg-white p-3 shadow-[0_18px_40px_rgba(11,37,90,.16)]">
          <div className="flex flex-col items-end gap-1">
            <Link href="/login" className="w-fit rounded-xl px-3 py-3 text-right text-base font-bold text-brand-primary hover:bg-surface-muted" onClick={() => setOpen(false)}>
              Log in
            </Link>
            {[{ href: "/services", label: "Services" }, { href: "/calculator", label: "Calculator" }, { href: "/preview", label: "3D Preview" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit rounded-xl px-3 py-3 text-right text-base font-medium text-text-primary hover:bg-surface-muted"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href={primaryCta.href} className="w-fit rounded-xl px-3 py-3 text-right text-base font-medium text-text-primary hover:bg-surface-muted" onClick={() => setOpen(false)}>{primaryCta.label}</Link>
            <a href="https://wa.me/919876543210" className="w-fit rounded-xl px-3 py-3 text-right text-base font-medium text-[#159447] hover:bg-surface-muted">WhatsApp</a>
            <a href="tel:+919876543210" className="w-fit rounded-xl px-3 py-3 text-right text-base font-medium text-text-primary hover:bg-surface-muted">+91 98765 43210</a>
          </div>
        </div>
      </div>
    </header>
  );
}
