import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useReveal } from '../hooks/useReveal';
import { useLandingStore } from '../store/useLandingStore';
import { Button } from '../components/buttons/Button';
import { Container } from '../components/common/Container';
import { SectionEyebrow } from '../components/common/SectionEyebrow';

export function CompanySection() {
  const { companySection } = siteConfig;
  const { ref, visible } = useReveal<HTMLElement>();
  const openLead = useLandingStore((s) => s.openLead);

  return (
    <section
      id="for-companies"
      ref={ref}
      className={`bg-obsidian text-ink-inverse py-20 sm:py-24 lg:py-28 reveal-section ${
        visible ? 'is-visible' : ''
      }`}
    >
      <Container narrow>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <SectionEyebrow tone="dark">{companySection.eyebrow}</SectionEyebrow>
            <h2 className="mt-3 font-display font-bold text-[34px] sm:text-[42px] leading-[1.08] tracking-[-0.025em] text-ink-inverse">
              {companySection.headingLine1}
              <br />
              {companySection.headingLine2}
              <span className="italic text-brand-light">{companySection.headingAccent}</span>
            </h2>
            <p className="mt-5 text-[14px] leading-[1.68] text-ink-inverse/75 max-w-[360px]">
              {companySection.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button variant="pink" size="md" onClick={() => openLead('hire')}>
                {companySection.primaryCta}
                <ArrowRight size={14} aria-hidden="true" />
              </Button>
              <Button variant="outline-dark" size="md" onClick={() => openLead('demo')}>
                {companySection.secondaryCta}
              </Button>
            </div>
          </div>

          {/* Right Column: Three stacked feature blocks */}
          <div className="lg:col-span-7 divide-y divide-white/10">
            {companySection.features.map((feature, index) => (
              <div
                key={feature.number}
                className={`${index === 0 ? 'pb-7' : index === companySection.features.length - 1 ? 'pt-7' : 'py-7'}`}
              >
                <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-brand-light tabular-nums">
                  {feature.eyebrow}
                </p>
                <h3 className="mt-2 font-display font-bold text-[19px] sm:text-[21px] leading-[1.25] text-ink-inverse">
                  {feature.heading}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-inverse/70 max-w-[460px]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
