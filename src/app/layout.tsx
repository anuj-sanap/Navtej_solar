import type { Metadata } from "next";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Clean Solar Energy`,
    template: `%s | ${site.name}`,
  },
  description:
    "Navtej Solartech Energy helps homes and businesses in Nashik transition to clean, reliable solar energy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
