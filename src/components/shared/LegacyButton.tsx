import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "outline-light" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed border border-transparent shadow-xs",
  secondary:
    "bg-brand-subtle text-brand hover:bg-brand-subtle hover:text-ink border border-[color:var(--color-border-subtle)]",
  outline:
    "bg-surface text-ink border border-line-strong hover:border-brand hover:text-brand",
  "outline-light":
    "bg-transparent text-ink-inverse border border-white/40 hover:bg-white/10",
  ghost:
    "bg-transparent text-ink-secondary hover:bg-surface-container hover:text-ink border border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[38px] px-3.5 py-2 text-[13px] leading-[18px] font-semibold",
  md: "min-h-[44px] px-5 py-2.5 text-[15px] leading-[20px] font-semibold",
  lg: "min-h-[48px] px-6 py-3 text-[15px] leading-[20px] font-semibold",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className = "",
  type = "button",
  ...props
}: {
  label: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`inline-flex items-center justify-center w-11 h-11 rounded-md border border-line bg-surface text-ink hover:border-brand hover:text-brand ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
