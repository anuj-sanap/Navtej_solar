import { trustStats } from "@/data/stats";
import { Container } from "@/components/ui/Container";

export function StatsSection() {
  return (
    <section id="about" aria-labelledby="stats-heading" className="bg-text-primary py-16 text-white sm:py-20">
      <Container>
        <div className="flex flex-col gap-8 border-b border-white/15 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">The Navtej difference</p>
            <h2 id="stats-heading" className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Clear advice. Better energy. A brighter return.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/65">
            Every recommendation starts with your needs, so the move to solar feels practical today and powerful for years to come.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustStats.map((stat) => (
            <article
              key={stat.id}
              className="rounded-3xl border border-white/10 bg-white/[0.06] px-5 py-6 transition-colors hover:bg-white/[0.1]"
            >
              <p className="text-3xl font-semibold tracking-tight text-brand-secondary">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-white/70">{stat.label}</p>
              {stat.isPlaceholder ? (
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
                  Placeholder
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
