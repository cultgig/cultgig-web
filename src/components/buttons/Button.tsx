import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant =
  | 'pink'
  | 'dark'
  | 'outline-light'
  | 'outline-dark'
  | 'ghost-dark';

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  pink: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed border border-transparent shadow-xs',
  dark: 'bg-ink-strong text-ink-inverse hover:bg-ink active:bg-black border border-transparent',
  'outline-light':
    'bg-surface text-ink border border-[color:var(--color-border-control)] hover:border-ink-strong hover:bg-surface-low',
  'outline-dark':
    'bg-transparent text-ink-inverse border border-white/25 hover:border-white/55 hover:bg-white/[0.06]',
  'ghost-dark':
    'bg-transparent text-ink hover:text-brand border border-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[12.5px] font-semibold',
  md: 'h-[42px] px-5 text-[13px] font-semibold',
  lg: 'h-[44px] px-6 text-[13.5px] font-semibold',
};

export function Button({
  variant = 'pink',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-2 disabled:bg-surface-high disabled:text-ink-secondary disabled:border-surface-high disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
