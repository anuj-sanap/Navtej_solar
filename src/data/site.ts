export const site = {
  name: "Navtej Solartech Energy",
  shortName: "Navtej",
  tagline: "Powering Nashik with Clean, Reliable Solar Energy",
} as const;

// Items displayed directly on the top navbar
export const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;

// Items moved to the right-side menu bar
export const menuBarItems = [
  {
    href: "/calculator",
    label: "Solar Calculator",
    subtitle: "Estimate system size & monthly savings",
  },
  {
    href: "/about",
    label: "About Us",
    subtitle: "Learn about Navtej Solartech Energy",
  },
] as const;

export const primaryCta = {
  href: "/contact",
  label: "Get Free Quote",
} as const;
