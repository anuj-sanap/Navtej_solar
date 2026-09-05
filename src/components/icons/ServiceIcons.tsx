type IconProps = {
  className?: string;
};

export function ResidentialIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 11.5 12 5l8 6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10.8V19h12v-8.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 19v-4h4v4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function CommercialIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 20V8h6v12M10 20V4h10v16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 8h1.5M16.5 8H18M13 11.5h1.5M16.5 11.5H18M13 15h1.5M16.5 15H18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ConsultationIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8.5v4l2.5 1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SunMark({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="28" height="28" rx="9" fill="currentColor" />
      <circle cx="16" cy="13.5" r="4" fill="white" />
      <path
        d="M7 22.5h18l-3.2-5.4a2 2 0 0 0-1.72-.96H11.92a2 2 0 0 0-1.72.96L7 22.5Z"
        fill="white"
        fillOpacity="0.92"
      />
      <path d="M10.2 20.2h11.6" stroke="#0B5CAB" strokeWidth="1.2" />
    </svg>
  );
}
