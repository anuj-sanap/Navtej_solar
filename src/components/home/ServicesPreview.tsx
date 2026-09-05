import Link from "next/link";
import { servicePreviews } from "@/data/services";
import { CommercialIcon, ConsultationIcon, ResidentialIcon } from "@/components/icons/ServiceIcons";
import { Container } from "@/components/ui/Container";
import type { ComponentType } from "react";

const icons: Record<string, ComponentType<{ className?: string }>> = {
  residential: ResidentialIcon,
  commercial: CommercialIcon,
  consultation: ConsultationIcon,
};

export function ServicesPreview() {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-background py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">What we do</p>
            <h2 id="services-heading" className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              Solar solutions that fit real life
            </h2>
            <p className="mt-3 text-base leading-7 text-text-secondary">
              From your first question to your first month of savings, we help make clean energy feel clear and achievable.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {servicePreviews.map((service) => {
            const Icon = icons[service.id] ?? ConsultationIcon;

            return (
              <article
                key={service.id}
                className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-white p-6 shadow-[0_10px_30px_rgba(16,35,31,0.04)] transition-all hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-[0_20px_40px_rgba(16,35,31,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0e7] text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-text-primary">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-text-secondary">{service.description}</p>
                <Link
                  href={service.href}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover"
                >
                  Learn More
                  <span aria-hidden="true" className="ml-2 transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
