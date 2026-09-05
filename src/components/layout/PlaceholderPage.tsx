import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <>
      <Navbar />
      <main className="bg-background">
        <Container className="py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">Coming next</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">{description}</p>
          <div className="mt-8">
            <Button href="/">Back to homepage</Button>
          </div>
        </Container>
      </main>
    </>
  );
}
