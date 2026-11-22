import { siteConfig } from '../config/siteConfig';
import { useReveal } from '../hooks/useReveal';
import { Container } from '../components/common/Container';

export function CandidateBenefits() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      aria-label="Candidate benefits"
      ref={ref}
      className={`bg-white pt-6 pb-20 sm:pb-24 reveal-section ${visible ? 'is-visible' : ''}`}
    >
      <Container narrow>
        <div className="pt-10 border-t border-line grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {siteConfig.candidateBenefits.map((benefit) => (
            <article key={benefit.number} className="flex items-start gap-4">
              <span className="font-display font-bold text-[14px] text-brand tabular-nums pt-0.5 shrink-0">
                {benefit.number}
              </span>
              <div>
                <h3 className="font-display font-bold text-[17px] leading-[1.3] text-ink-strong">
                  {benefit.heading}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-secondary max-w-[380px]">
                  {benefit.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
