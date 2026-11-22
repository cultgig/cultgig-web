import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useReveal } from '../hooks/useReveal';
import { useLandingStore } from '../store/useLandingStore';
import { Button } from '../components/buttons/Button';
import { Container } from '../components/common/Container';
import { SectionEyebrow } from '../components/common/SectionEyebrow';
import { ReachAgentDashboard } from '../components/product-previews/ReachAgentDashboard';

export function ReachSection() {
  const { reachSection } = siteConfig;
  const { ref, visible } = useReveal<HTMLElement>();
  const openLead = useLandingStore((s) => s.openLead);

  return (
    <section
      id="reach"
      ref={ref}
      className={`bg-page border-t border-line py-20 sm:py-24 lg:py-28 reveal-section ${
        visible ? 'is-visible' : ''
      }`}
    >
      <Container narrow>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <SectionEyebrow>{reachSection.eyebrow}</SectionEyebrow>
            <h2 className="mt-3 font-display font-bold text-[34px] sm:text-[42px] leading-[1.08] tracking-[-0.025em] text-ink-strong">
              {reachSection.headingLine1}
              <br />
              {reachSection.headingLine2}
              <br />
              <span className="italic text-brand">{reachSection.headingAccent}</span>
            </h2>
            <p className="mt-4 text-[14px] leading-[1.68] text-ink-secondary max-w-[360px]">
              {reachSection.description}
            </p>
            <div className="mt-7">
              <Button variant="dark" size="md" onClick={() => openLead('demo')}>
                {reachSection.ctaLabel}
                <ArrowRight size={14} aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Dark AI Recruitment Dashboard */}
          <div className="lg:col-span-7">
            <ReachAgentDashboard />
          </div>
        </div>
      </Container>
    </section>
  );
}
