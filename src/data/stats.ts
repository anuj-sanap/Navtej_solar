/**
 * Homepage trust metrics.
 *
 * Values are preview placeholders until Navtej Solartech Energy
 * supplies verified company figures. Do not treat these as production facts.
 */
export type TrustStat = {
  id: string;
  value: string;
  label: string;
  isPlaceholder: true;
};

export const trustStats: TrustStat[] = [
  {
    id: "installations",
    value: "XX+",
    label: "Solar Installations",
    isPlaceholder: true,
  },
  {
    id: "capacity",
    value: "XX MW+",
    label: "Clean Energy Generated",
    isPlaceholder: true,
  },
  {
    id: "customers",
    value: "XX+",
    label: "Happy Customers",
    isPlaceholder: true,
  },
  {
    id: "experience",
    value: "XX",
    label: "Years of Experience",
    isPlaceholder: true,
  },
];
