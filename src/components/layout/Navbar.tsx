"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, primaryCta, site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import logo from "../../../navtej logo.jpeg";

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

        <div className="hidden lg:block">
          <Button href={primaryCta.href} className="px-4 text-[13px]">
            {primaryCta.label}
          </Button>
        </div>

        <div className="hidden items-center gap-3 text-xs font-bold text-brand-primary xl:flex">
          <a href="https://wa.me/919876543210" aria-label="Chat with Navtej Solartech Energy on WhatsApp" className="text-[#159447]">WhatsApp</a>
          <a href="tel:+919876543210" aria-label="Call Navtej Solartech Energy">+91 98765 43210</a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text-primary ring-1 ring-border lg:hidden"
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
        className={`lg:hidden ${open ? "block" : "hidden"}`}
      >
        <div className="border-t border-border bg-white">
          <Container className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-text-primary hover:bg-surface-muted"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Button href={primaryCta.href} className="w-full">
                {primaryCta.label}
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
