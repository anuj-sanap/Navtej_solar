export type ServicePreview = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export const servicePreviews: ServicePreview[] = [
  {
    id: "residential",
    title: "Residential Solar",
    description:
      "Rooftop solar designed for homes that want lower electricity bills and long-term energy independence.",
    href: "/services",
  },
  {
    id: "commercial",
    title: "Commercial Solar",
    description:
      "Scalable systems for businesses looking to control operating costs with reliable on-site generation.",
    href: "/services",
  },
  {
    id: "consultation",
    title: "Solar Consultation",
    description:
      "A clear assessment of your site, consumption and savings potential before you commit to installation.",
    href: "/contact",
  },
];
