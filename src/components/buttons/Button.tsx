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
  pink: 'bg-[#D11F68] text-white hover:bg-[#B51758] active:bg-[#981249] border border-transparent shadow-sm',
  dark: 'bg-[#051315] text-white hover:bg-[#1B1818] active:bg-black border border-transparent',
  'outline-light':
    'bg-transparent text-[#051315] border border-[#DEDEDE] hover:border-[#051315] hover:bg-[#FAFAFA]',
  'outline-dark':
    'bg-transparent text-white border border-white/25 hover:border-white/55 hover:bg-white/[0.06]',
  'ghost-dark':
    'bg-transparent text-[#051315] hover:text-[#D11F68] border border-transparent',
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
      className={`inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D11F68] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
