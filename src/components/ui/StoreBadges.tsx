import React from "react";
import { brandConfig } from "../../config/brand";

interface StoreBadgesProps {
  className?: string;
  badgeHeight?: string;
  align?: "left" | "center";
}

export const StoreBadges: React.FC<StoreBadgesProps> = ({
  className = "",
  badgeHeight = "h-[44px] sm:h-[48px]",
  align = "left",
}) => {
  return (
    <div
      className={`flex items-center gap-3 flex-wrap ${
        align === "center" ? "justify-center" : "justify-start"
      } ${className}`}
    >
      <a
        href={brandConfig.appStoreBadges.googlePlay.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Pronto on Google Play Store"
        className="inline-block transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-green-600 rounded-lg overflow-hidden shrink-0"
      >
        <img
          src={brandConfig.appStoreBadges.googlePlay.image}
          alt={brandConfig.appStoreBadges.googlePlay.alt}
          className={`${badgeHeight} w-auto object-contain rounded-lg`}
          width="160"
          height="48"
          loading="lazy"
        />
      </a>
      <a
        href={brandConfig.appStoreBadges.appStore.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Pronto on Apple App Store"
        className="inline-block transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-green-600 rounded-lg overflow-hidden shrink-0"
      >
        <img
          src={brandConfig.appStoreBadges.appStore.image}
          alt={brandConfig.appStoreBadges.appStore.alt}
          className={`${badgeHeight} w-auto object-contain rounded-lg`}
          width="160"
          height="48"
          loading="lazy"
        />
      </a>
    </div>
  );
};
