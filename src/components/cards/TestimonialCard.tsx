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
          ? 'bg-[#051315] text-white border border-white/10'
          : 'bg-[#FDF1F8] text-[#051315] border border-[#F4DCEB]'
      }`}
    >
      <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#D11F68]">
        {item.roleLabel}
      </p>
      <blockquote
        className={`mt-3 text-[15px] sm:text-[15.5px] leading-[1.6] italic font-normal ${
          isDark ? 'text-white/90' : 'text-[#051315]'
        }`}
      >
        {item.quote}
      </blockquote>
    </article>
  );
}
