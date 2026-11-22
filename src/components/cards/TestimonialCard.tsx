import { TestimonialItem } from '../../types';

interface TestimonialCardProps {
  item: TestimonialItem;
}

export function TestimonialCard({ item }: TestimonialCardProps) {
  const isDark = item.variant === 'dark';

  return (
    <article
      className={`rounded-[16px] p-7 sm:p-8 flex flex-col justify-between min-h-[168px] transition-transform duration-200 hover:-translate-y-0.5 ${
        isDark
          ? 'bg-obsidian text-ink-inverse border border-white/10'
          : 'bg-brand-subtle text-ink-primary border border-accent-border'
      }`}
    >
      <p
        className={`text-[10.5px] font-semibold tracking-[0.14em] uppercase ${
          isDark ? 'text-brand-light' : 'text-brand'
        }`}
      >
        {item.roleLabel}
      </p>
      <blockquote
        className={`mt-3 text-[15px] sm:text-[15.5px] leading-[1.6] italic font-normal ${
          isDark ? 'text-ink-inverse/90' : 'text-ink-primary'
        }`}
      >
        {item.quote}
      </blockquote>
    </article>
  );
}
