import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white shadow-[0_10px_24px_rgba(23,107,77,0.18)] hover:bg-brand-primary-hover focus-visible:outline-brand-primary",
  secondary:
    "bg-white text-text-primary ring-1 ring-inset ring-border hover:bg-surface-muted focus-visible:outline-brand-primary",
};

export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${variants[variant]} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
