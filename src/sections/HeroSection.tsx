import { Calendar, MessageSquare, Users } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useLandingStore } from '../store/useLandingStore';
import { HeroAudienceCards } from '../components/cards/HeroAudienceCards';
import { Container } from '../components/common/Container';

export function HeroSection() {
  const { hero } = siteConfig;
  const openJobs = useLandingStore((s) => s.openJobs);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-page pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-16"
    >
      {/* Subtle olive-tinted ambient wash behind cards */}
      <div
        aria-hidden="true"
        className="hero-ambient-wash pointer-events-none absolute inset-x-0 top-12 h-[540px]"
      />

      <Container className="relative z-10">
        {/* Floating Notification Pills (Desktop only, well outside headline bounds) */}
        <div
          aria-hidden="true"
          className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface border border-line shadow-pill text-[11.5px] font-medium text-ink-strong absolute left-2 top-24 animate-float-gentle"
        >
          <Calendar size={13} className="text-semantic-success" />
          <span>{hero.floatingPills.left.label}</span>
        </div>

        <div
          aria-hidden="true"
          className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface border border-line shadow-pill text-[11.5px] font-medium text-ink-strong absolute right-4 top-20 animate-float-delayed"
        >
          <Users size={13} className="text-semantic-success" />
          <span>{hero.floatingPills.rightTop.label}</span>
        </div>

        <div
          aria-hidden="true"
          className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface border border-line shadow-pill text-[11.5px] font-medium text-ink-strong absolute right-0 top-36 animate-float-gentle"
        >
          <MessageSquare size={13} className="text-brand" />
          <span>{hero.floatingPills.rightBottom.label}</span>
        </div>

        {/* Centered Headline & Subtitle */}
        <div className="max-w-[760px] mx-auto text-center">
          <h1 className="font-display font-bold text-[40px] sm:text-[54px] lg:text-[62px] leading-[1.03] tracking-[-0.03em] text-ink-strong">
            <span className="block">{hero.line1}</span>
            <span className="block italic text-brand mt-1">{hero.line2}</span>
          </h1>
          <p className="mt-5 max-w-[500px] mx-auto text-[14.5px] sm:text-[15.5px] leading-[1.6] text-ink-secondary">
            {hero.description}
          </p>
        </div>

        {/* Dual Audience Cards */}
        <div className="mt-10 sm:mt-12">
          <HeroAudienceCards />
        </div>

        {/* Bottom Browse Link */}
        <div className="mt-6 text-center">
          <p className="text-[12.5px] text-ink-secondary">
            {hero.browsePrompt}{' '}
            <button
              type="button"
              onClick={() => openJobs()}
              className="font-semibold text-ink-strong underline underline-offset-4 decoration-line-strong hover:text-brand hover:decoration-brand transition-colors"
            >
              {hero.browseLinkLabel}
            </button>
          </p>
        </div>
      </Container>
    </section>
  );
}
