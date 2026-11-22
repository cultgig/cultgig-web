import { siteConfig } from '../config/siteConfig';
import { CompanyLogoItem } from '../types';
import { Container } from '../components/common/Container';

function LogoWordmark({ item }: { item: CompanyLogoItem }) {
  switch (item.displayStyle) {
    case 'scale':
      return (
        <span className="font-display font-medium text-[18px] tracking-[-0.03em] text-[#5C6264]">
          scale
        </span>
      );
    case 'neuralink':
      return (
        <span className="inline-flex items-center gap-1.5 font-display font-semibold text-[15px] tracking-[0.06em] uppercase text-[#5C6264]">
          <svg width="16" height="12" viewBox="0 0 20 14" fill="none" aria-hidden="true">
            <path d="M2 12L7.5 2L11 9.5L15 5L18 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Neuralink
        </span>
      );
    case 'cognition':
      return (
        <span className="font-display font-semibold text-[15.5px] tracking-[-0.02em] text-[#2F3638]">
          Cognition
        </span>
      );
    case 'brex':
      return (
        <span className="font-sans font-semibold text-[15px] tracking-[0.06em] uppercase text-[#646A6B]">
          BREX
        </span>
      );
    case 'lovable':
      return (
        <span className="inline-flex items-center gap-1.5 font-display font-bold text-[16px] tracking-[-0.02em] text-[#051315]">
          <span className="w-3.5 h-3.5 rounded-[4px] bg-[#D11F68]/85 inline-block" aria-hidden="true" />
          Lovable
        </span>
      );
    case 'chime':
      return (
        <span className="font-display font-bold text-[17px] tracking-[-0.02em] text-[#226F49]">
          chime
        </span>
      );
    case 'flock':
      return (
        <span className="font-sans font-bold text-[13px] tracking-[0.18em] uppercase text-[#7C8284]">
          FLOCK
        </span>
      );
    case 'postman':
      return (
        <span className="font-sans font-bold text-[13.5px] tracking-[0.12em] uppercase text-[#C2572B]">
          POSTMAN
        </span>
      );
    case 'klaviyo':
      return (
        <span className="px-2.5 py-1 rounded-[4px] bg-[#D94F30] text-white font-display font-bold text-[12px] tracking-[-0.01em]">
          klaviyo
        </span>
      );
    case 'braze':
      return (
        <span className="font-display font-bold italic text-[18px] tracking-[-0.03em] text-[#202729]">
          braze
        </span>
      );
    case 'zipline':
      return (
        <span className="font-display font-extrabold text-[17px] tracking-[-0.03em] text-[#051315]">
          zipline
        </span>
      );
    case 'applied':
      return (
        <span className="font-sans font-medium text-[13px] tracking-[-0.01em] text-[#3E4547]">
          Applied Intuition
        </span>
      );
    case 'astranis':
      return (
        <span className="font-sans font-semibold text-[13px] tracking-[0.16em] uppercase text-[#5C6264]">
          ASTRANIS
        </span>
      );
  }
}

export function LogoStripSection() {
  const { trustedCompanies } = siteConfig;

  return (
    <section
      aria-label="Trusted startups hiring on Cultgig"
      className="bg-[#FAFAFA] border-y border-[#EDEDED] py-10 sm:py-12 overflow-hidden"
    >
      <Container>
        <p className="text-center font-display font-medium text-[16px] sm:text-[18px] text-[#051315]">
          {trustedCompanies.heading}
        </p>
      </Container>

      {/* Subtle continuous marquee (pauses on hover & reduced motion) */}
      <div className="marquee-wrapper mt-7 overflow-hidden">
        <div className="animate-marquee items-center">
          {[0, 1].map((dupIndex) => (
            <ul
              key={dupIndex}
              aria-hidden={dupIndex === 1}
              className="flex items-center gap-10 sm:gap-12 px-6 shrink-0"
            >
              {trustedCompanies.logos.map((logo) => (
                <li
                  key={`${dupIndex}-${logo.name}`}
                  className="h-8 flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity shrink-0"
                >
                  <LogoWordmark item={logo} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <Container>
        <p className="mt-7 text-center text-[10px] font-semibold tracking-[0.14em] uppercase text-[#646A6B] tabular-nums">
          {trustedCompanies.supportingPrefix}{' '}
          <span className="text-[#D11F68]">{trustedCompanies.supportingHighlight}</span>{' '}
          {trustedCompanies.supportingSuffix}
        </p>
      </Container>
    </section>
  );
}
