import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  const services = [
    ["On-grid solar", "The dependable choice for homes and businesses connected to the grid. Reduce your bill while keeping grid backup.", "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=85"],
    ["Off-grid solar", "Battery-backed power for farms, remote properties and locations that need energy independence.", "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80"],
    ["Hybrid solar", "Balance solar generation, batteries and the grid for resilient power through every season.", "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80"],
    ["Residential installation", "A roof-first design, tidy installation and clear support for families across Nashik.", "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=1200&q=80"],
    ["Commercial solar", "Lower operating costs with high-performance systems designed around your business hours and load.", "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80"],
    ["Maintenance & upgrades", "Monitoring, cleaning, inverter upgrades and responsive support to protect your investment.", "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80"],
  ];
  return <><Navbar /><main className="bg-background"><section className="bg-white py-16 sm:py-24"><Container><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Solar solutions</p><h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] text-brand-primary sm:text-6xl">The right system for how you use energy.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">From a family rooftop to a growing facility, Navtej Solartech Energy designs, installs and supports solar systems that make financial sense.</p></Container></section><section className="py-12 sm:py-20"><Container><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.map(([title, description, image]) => <article key={title} className="group overflow-hidden rounded-3xl bg-white shadow-[0_12px_32px_rgba(11,37,90,.06)]"><div className="relative h-56 overflow-hidden"><Image src={image} alt={`${title} by Navtej Solartech Energy`} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" /></div><div className="p-6"><h2 className="text-2xl font-semibold text-brand-primary">{title}</h2><p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p><Link href="/contact" className="mt-6 inline-flex text-sm font-bold text-brand-primary">Plan your system <span className="ml-2">↗</span></Link></div></article>)}</div></Container></section><section className="bg-brand-primary py-16 text-white"><Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">Not sure where to start?</p><h2 className="mt-3 text-3xl font-semibold">Book a free Nashik site visit.</h2></div><Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-secondary px-6 text-sm font-bold text-brand-primary">Get a free quote</Link></Container></section></main></>;
}
