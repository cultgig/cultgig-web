import React, { useRef } from "react";
import { brandConfig } from "../../config/brand";
import { citiesData } from "../../data/cities";
import { StoreBadges } from "../ui/StoreBadges";
import { Stars } from "../ui/Stars";

export const Hero: React.FC = () => {
  const popularCities = citiesData.filter((c) => c.isPopular);
  const remainingCount = citiesData.length - popularCities.length;
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-[640px] lg:min-h-[720px] bg-white pt-6 pb-16 lg:py-16 overflow-hidden"
    >
      {/* Background Soft Mint Wash */}
      <div
        className="absolute top-0 right-0 w-[55vw] max-w-[850px] h-[750px] bg-gradient-to-bl from-mint-100/90 via-mint-100/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none translate-x-[15%] -translate-y-[10%]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[30vw] h-[300px] bg-gradient-to-tr from-mint-100/40 to-transparent rounded-full blur-2xl -z-10 pointer-events-none -translate-x-[20%]"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT Column */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* 1. Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint-100/80 text-green-700 text-[12px] sm:text-[13px] font-sans font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-600 shrink-0" aria-hidden="true" />
              <span>{brandConfig.heroChip}</span>
            </div>

            {/* 2. H1 Headline */}
            <h1 className="font-heading font-bold text-[44px] sm:text-[56px] md:text-[68px] lg:text-[76px] leading-[1.02] tracking-[-0.02em] text-ink text-balance">
              Trusted house help <br className="hidden sm:inline" />
              in minutes!
            </h1>

            {/* 3. Value Proposition Paragraph */}
            <p className="mt-5 text-[17px] sm:text-[19px] leading-[1.5] text-grey-500 max-w-[48ch] font-sans">
              {brandConfig.heroParagraph}
            </p>

            {/* 4. Request Locality Link */}
            <div className="mt-5">
              <a
                href={brandConfig.requestLocalityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-medium text-green-600 hover:text-green-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
              >
                <span>Request Pronto in your locality</span>
                <svg
                  className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>

            {/* 5. App Store Badges */}
            <div className="mt-7">
              <StoreBadges badgeHeight="h-[46px] sm:h-[48px]" />
            </div>

            {/* 6. Rating Line */}
            <div className="mt-4 flex items-center gap-2 text-[13px] text-grey-500 font-sans">
              <Stars count={5} size={14} />
              <span className="font-semibold text-ink">{brandConfig.rating.score}</span>
              <span>from {brandConfig.rating.totalRatings}</span>
            </div>

            {/* 7. Live In City Chips */}
            <div className="mt-8 pt-6 border-t border-border/80 w-full max-w-[560px]">
              <div className="flex items-center gap-2.5 flex-wrap text-[13px] font-sans">
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-green-600 shrink-0">
                  LIVE IN
                </span>
                {popularCities.map((city, idx) => (
                  <React.Fragment key={city.id}>
                    <span className="text-ink/80 hover:text-green-600 transition-colors">
                      {city.name}
                    </span>
                    {idx < popularCities.length - 1 && (
                      <span className="text-border" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
                {remainingCount > 0 && (
                  <span className="text-green-600 font-semibold cursor-pointer hover:underline">
                    +{remainingCount} more cities
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT Column: Smiling Professional Hero Cutout */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-4 lg:mt-0">
            {/* Circular mint backdrop highlight */}
            <div
              className="absolute inset-0 m-auto w-[320px] sm:w-[420px] lg:w-[480px] h-[320px] sm:h-[420px] lg:h-[480px] bg-mint-100 rounded-full -z-10"
              aria-hidden="true"
            />
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[540px] flex justify-center">
              <img
                src="/assets/hero/hero-pro-namaste.png"
                alt="Smiling Pronto professional in green uniform greeting with namaste"
                width="680"
                height="1300"
                loading="eager"
                decoding="async"
                className="w-full h-auto max-h-[520px] sm:max-h-[600px] lg:max-h-[660px] object-contain object-bottom select-none drop-shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
