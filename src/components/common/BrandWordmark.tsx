interface BrandWordmarkProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function BrandWordmark({ variant = 'dark', className = '' }: BrandWordmarkProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-[#051315]';
  return (
    <span
      className={`inline-flex items-baseline font-display font-extrabold tracking-[-0.035em] text-[22px] leading-none select-none whitespace-nowrap shrink-0 ${textColor} ${className}`}
    >
      cultgig
      <span className="text-[#D11F68]" aria-hidden="true">
        :
      </span>
    </span>
  );
}
