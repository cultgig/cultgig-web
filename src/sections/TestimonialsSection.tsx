import { siteConfig } from '../config/siteConfig';
import { useReveal } from '../hooks/useReveal';
import { TestimonialCard } from '../components/cards/TestimonialCard';
import { Container } from '../components/common/Container';
import { SectionEyebrow } from '../components/common/SectionEyebrow';

export function TestimonialsSection() {
  const { testimonials } = siteConfig;
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="testimonials"
      ref={ref}
      className={`bg-page border-t border-line py-20 sm:py-24 reveal-section ${
        visible ? 'is-visible' : ''
      }`}
    >
      <Container narrow>
        <div className="text-center">
          <SectionEyebrow>{testimonials.eyebrow}</SectionEyebrow>
          <h2 className="mt-2.5 font-display font-bold text-[34px] sm:text-[42px] leading-[1.08] tracking-[-0.025em] text-ink-strong">
            {testimonials.headingLead}
            <br />
            <span className="italic text-brand">{testimonials.headingAccent}</span>
          </h2>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.items.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
