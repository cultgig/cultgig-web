import React, { useRef } from "react";
import { StatItem } from "../../types";
import { useCountUp } from "../../hooks/useCountUp";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface StatCardProps {
  stat: StatItem;
}

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(cardRef, 0.3);
  const countDisplay = useCountUp(stat.number, 1400, isVisible);

  const renderIcon = () => {
    switch (stat.iconType) {
      case "home":
        return (
          <svg
            className="w-5 h-5 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case "clock":
        return (
          <svg
            className="w-5 h-5 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case "user":
      default:
        return (
          <svg
            className="w-5 h-5 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-mint-100 rounded-stat p-6 sm:p-7 flex items-center gap-4 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
        {renderIcon()}
      </div>
      <div>
        <div className="font-heading font-bold text-[32px] sm:text-[36px] md:text-[42px] leading-none text-ink tabular-nums">
          <span>{countDisplay}</span>
          <span className="text-green-600">{stat.suffix}</span>
        </div>
        <p className="mt-1 text-[13px] sm:text-[14px] text-grey-500 font-sans font-medium">
          {stat.label}
        </p>
      </div>
    </div>
  );
};
