import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PlaceholderPage
      title="Get a free consultation"
      description="The enquiry form, WhatsApp action and confirmed contact details will be added in a later task. This page is a navigation placeholder for the homepage preview."
    />
  );
}
