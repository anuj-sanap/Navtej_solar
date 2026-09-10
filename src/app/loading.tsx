import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <main className="grid min-h-[calc(100svh-5rem)] place-items-center bg-background">
      <Container className="flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary" role="status" aria-live="polite">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-secondary" />
          Loading page...
        </div>
      </Container>
    </main>
  );
}
