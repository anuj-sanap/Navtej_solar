import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

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
      <body className={`${manrope.variable} ${playfair.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
