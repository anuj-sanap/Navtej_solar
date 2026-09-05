import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About Navtej Solartech Energy"
      description="This page is a temporary placeholder for the client homepage preview. Company story, mission and verified credentials will be added when content is confirmed."
    />
  );
}
