interface SectionEyebrowProps {
  children: string;
  tone?: 'light' | 'dark';
  className?: string;
}

export function SectionEyebrow({
  children,
  tone = 'light',
  className = '',
}: SectionEyebrowProps) {
  const toneClass = tone === 'dark' ? 'text-brand-light' : 'text-brand';
  return (
    <p
      className={`font-sans text-[11px] font-semibold tracking-[0.14em] uppercase ${toneClass} ${className}`}
    >
      {children}
    </p>
  );
}
