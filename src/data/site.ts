export const site = {
  name: "Navtej Solartech Energy",
  shortName: "Navtej",
  tagline: "Powering Nashik with Clean, Reliable Solar Energy",
} as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/projects", label: "Projects" },
] as const;

export const primaryCta = {
  href: "/contact",
  label: "Get Free Quote",
} as const;
