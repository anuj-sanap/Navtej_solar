import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroVisual } from "@/components/home/HeroVisual";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
      <Container className="relative grid items-center gap-12 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:py-20">
        <div className="max-w-xl">
          <div className="animate-rise-in inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-primary backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
            Energy, made brighter
          </div>
          <h1 className="animate-rise-in-delay mt-6 max-w-2xl text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.065em] text-text-primary sm:text-6xl lg:text-[5.2rem]">
            A smarter way to power <span className="text-brand-primary">what&apos;s next.</span>
          </h1>
          <p className="animate-rise-in-delay mt-6 max-w-lg text-base leading-7 text-text-secondary sm:text-lg">
            Navtej Solartech Energy makes the switch to solar simple, dependable and built around your real energy needs, from first consultation to long-term savings.
          </p>
          <div className="animate-rise-in-delay mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/contact">Get Free Consultation</Button>
            <Button href="/calculator" variant="secondary">
              Calculate Your Savings <span aria-hidden="true" className="ml-2">↗</span>
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs font-semibold text-text-secondary">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="h-8 w-8 rounded-full border-2 border-background bg-[#e9b47a]" />
              <span className="h-8 w-8 rounded-full border-2 border-background bg-[#8ab6a1]" />
              <span className="h-8 w-8 rounded-full border-2 border-background bg-[#607d91]" />
            </span>
            Trusted guidance for your next energy move
          </div>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
