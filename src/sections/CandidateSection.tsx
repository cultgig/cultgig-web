import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useReveal } from '../hooks/useReveal';
import { useLandingStore } from '../store/useLandingStore';
import { Button } from '../components/buttons/Button';
import { Container } from '../components/common/Container';
import { SectionEyebrow } from '../components/common/SectionEyebrow';
import { CandidateSearchPreview } from '../components/product-previews/CandidateSearchPreview';

export function CandidateSection() {
  const { candidateSection } = siteConfig;
  const { ref, visible } = useReveal<HTMLElement>();
  const openAuth = useLandingStore((s) => s.openAuth);
  const openInfo = useLandingStore((s) => s.openInfo);

  return (
    <section
      id="for-candidates"
      ref={ref}
      className={`bg-white pt-20 pb-14 sm:pt-24 sm:pb-16 reveal-section ${
        visible ? 'is-visible' : ''
      }`}
    >
      <Container narrow>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <SectionEyebrow>{candidateSection.eyebrow}</SectionEyebrow>
            <h2 className="mt-3 font-display font-bold text-[34px] sm:text-[42px] leading-[1.08] tracking-[-0.025em] text-[#051315]">
              {candidateSection.headingLine1}
              <br />
              <span className="italic text-[#D11F68]">{candidateSection.headingAccent}</span>
            </h2>
            <p className="mt-4 text-[14px] leading-[1.68] text-[#646A6B] max-w-[330px]">
              {candidateSection.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button variant="pink" size="md" onClick={() => openAuth('sign-up', 'candidate')}>
                {candidateSection.primaryCta}
                <ArrowRight size={14} aria-hidden="true" />
              </Button>
              <Button variant="outline-light" size="md" onClick={() => openInfo('about')}>
                {candidateSection.secondaryCta}
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Job Search UI Preview */}
          <div className="lg:col-span-7">
            <CandidateSearchPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}
