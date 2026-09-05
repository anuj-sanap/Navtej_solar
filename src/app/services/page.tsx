import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <PlaceholderPage
      title="Solar services"
      description="Detailed service pages are not part of this homepage preview. The homepage already includes a residential, commercial and consultation snapshot."
    />
  );
}
