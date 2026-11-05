import React from "react";
import { pressData } from "../../data/press";

export const PressStrip: React.FC = () => {
  return (
    <section
      aria-label="Press and Media Features"
      className="w-full bg-white border-y border-border py-8 sm:py-10 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        <p className="text-center text-[11px] font-semibold tracking-[0.16em] uppercase text-grey-500 font-sans mb-6">
          FEATURED IN
        </p>

        {/* Desktop: Centered and evenly spaced */}
        <div className="hidden md:flex items-center justify-between gap-8 lg:gap-12 flex-wrap">
          {pressData.map((logo) => (
            <a
              key={logo.id}
              href={logo.href || "#"}
              onClick={(e) => {
                if (!logo.href || logo.href === "#") e.preventDefault();
              }}
              aria-label={`Read ${logo.name} coverage`}
              className="inline-flex items-center opacity-85 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            >
              <img
                src={logo.svgPath}
                alt={logo.alt}
                width={logo.width || 120}
                height={logo.height || 28}
                className="h-[24px] lg:h-[28px] w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </a>
          ))}
        </div>

        {/* Mobile: Horizontal scrolling row with hidden scrollbar */}
        <div className="md:hidden flex items-center gap-8 overflow-x-auto pb-2 scrollbar-none snap-x">
          {pressData.map((logo) => (
            <a
              key={logo.id}
              href={logo.href || "#"}
              onClick={(e) => {
                if (!logo.href || logo.href === "#") e.preventDefault();
              }}
              aria-label={`Read ${logo.name} coverage`}
              className="inline-flex items-center shrink-0 snap-center opacity-90 hover:opacity-100"
            >
              <img
                src={logo.svgPath}
                alt={logo.alt}
                width={logo.width || 120}
                height={logo.height || 28}
                className="h-[22px] w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
