import React from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface MarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: "normal" | "slow";
  className?: string;
  pauseOnHover?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  direction = "left",
  speed = "normal",
  className = "",
  pauseOnHover = true,
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={`overflow-x-auto flex gap-4 pb-4 snap-x ${className}`}>
        {children}
      </div>
    );
  }

  const animationClass =
    direction === "right"
      ? "animate-marquee-reverse"
      : speed === "slow"
      ? "animate-marquee-left-slow"
      : "animate-marquee-left";

  return (
    <div
      className={`marquee-container relative w-full overflow-hidden flex ${className}`}
    >
      <div
        className={`flex shrink-0 items-center gap-4 sm:gap-6 py-2 ${animationClass} ${
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        }`}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center gap-4 sm:gap-6 py-2 ${animationClass} ${
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};
