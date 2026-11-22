interface BrandWordmarkProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function BrandWordmark({ variant = 'dark', className = '' }: BrandWordmarkProps) {
  const textColor = variant === 'light' ? 'text-ink-inverse' : 'text-ink-strong';
  const accentColor = variant === 'light' ? 'text-brand-light' : 'text-brand';
  return (
    <span
      className={`inline-flex items-baseline font-display font-extrabold tracking-[-0.035em] text-[22px] leading-none select-none whitespace-nowrap shrink-0 ${textColor} ${className}`}
    >
      cultgig
      <span className={accentColor} aria-hidden="true">
        :
      </span>
    </span>
  );
}
