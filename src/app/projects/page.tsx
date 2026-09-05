import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <PlaceholderPage
      title="Projects gallery"
      description="Project case studies will appear here after approved portfolio content and images are provided. This route exists so navigation works during the homepage preview."
    />
  );
}
