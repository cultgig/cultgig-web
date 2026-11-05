import React from "react";
import { StoreBadges } from "../ui/StoreBadges";

export const ClosingCta: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-24 lg:py-28 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="relative max-w-[1000px] mx-auto bg-mint-100 rounded-panel pt-14 sm:pt-16 pb-12 sm:pb-14 px-6 sm:px-10 text-center flex flex-col items-center overflow-hidden shadow-sm">
          {/* Fanned 3 Phones Graphic */}
          <div className="relative w-full max-w-[480px] sm:max-w-[540px] mb-8 sm:mb-10 flex justify-center">
            <img
              src="/assets/cta/closing-cta-fan.webp"
              alt="Pronto app screens showcasing instant booking and multi-task selection"
              width="700"
              height="520"
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain select-none drop-shadow-md"
            />
          </div>

          {/* Heading */}
          <h2 className="font-heading font-bold text-[34px] sm:text-[44px] md:text-[52px] lg:text-[58px] leading-[1.05] tracking-[-0.015em] text-ink max-w-[680px] text-balance">
            Get trusted house help in minutes.
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-[16px] sm:text-[18px] text-grey-500 font-sans max-w-[480px]">
            Download the Pronto app and book your first service today.
          </p>

          {/* Store Badges */}
          <div className="mt-8 flex justify-center">
            <StoreBadges align="center" badgeHeight="h-[46px] sm:h-[48px]" />
          </div>
        </div>
      </div>
    </section>
  );
};
