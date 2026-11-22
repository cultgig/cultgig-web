interface SectionEyebrowProps {
  children: string;
  className?: string;
}

export function SectionEyebrow({ children, className = '' }: SectionEyebrowProps) {
  return (
    <p
      className={`font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#D11F68] ${className}`}
    >
      {children}
    </p>
  );
}
