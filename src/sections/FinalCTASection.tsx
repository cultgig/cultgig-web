import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useLandingStore } from '../store/useLandingStore';
import { Button } from '../components/buttons/Button';
import { Container } from '../components/common/Container';

export function FinalCTASection() {
  const { finalCta } = siteConfig;
  const openAuth = useLandingStore((s) => s.openAuth);
  const openLead = useLandingStore((s) => s.openLead);

  return (
    <section className="relative overflow-hidden bg-obsidian text-ink-inverse py-20 sm:py-24 lg:py-28">
      {/* Subtle restrained olive radial glow behind headline */}
      <div
        aria-hidden="true"
        className="final-cta-glow pointer-events-none absolute inset-0 animate-glow-breathe"
      />

      <Container className="relative z-10 text-center">
        <h2 className="font-display font-bold text-[36px] sm:text-[46px] lg:text-[52px] leading-[1.08] tracking-[-0.03em] text-ink-inverse">
          {finalCta.headingLead}
          <span className="italic text-brand-light">{finalCta.headingAccent}</span>
        </h2>
        <p className="mt-4 text-[14.5px] sm:text-[15.5px] text-ink-inverse/75 max-w-[440px] mx-auto">
          {finalCta.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Button variant="pink" size="lg" onClick={() => openAuth('sign-up', 'candidate')}>
            {finalCta.primaryCta}
            <ArrowRight size={15} aria-hidden="true" />
          </Button>
          <Button variant="outline-dark" size="lg" onClick={() => openLead('hire')}>
            {finalCta.secondaryCta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
