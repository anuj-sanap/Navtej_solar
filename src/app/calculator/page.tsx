import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "Solar Calculator",
};

export default function CalculatorPage() {
  return (
    <PlaceholderPage
      title="Solar savings calculator"
      description="The interactive calculator is intentionally not included in this preview. This placeholder keeps the primary homepage CTA working until the calculation engine is implemented."
    />
  );
}
