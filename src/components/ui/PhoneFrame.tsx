import React, { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface PhoneFrameProps {
  screens: string[];
  alt: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ screens, alt }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (screens.length <= 1 || isPaused || reducedMotion) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % screens.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [screens.length, isPaused, reducedMotion]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative w-full aspect-[3/3.8] bg-green-600 rounded-frame overflow-hidden flex items-end justify-center pt-5 px-5 sm:px-6 shadow-md"
    >
      {/* Phone container */}
      <div className="relative w-full max-w-[280px] h-[92%] bg-ink rounded-t-[32px] border-[5px] border-b-0 border-ink shadow-2xl overflow-hidden flex flex-col">
        {/* Dynamic Island / Notch pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-ink rounded-full z-20 flex items-center justify-end pr-2">
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
        </div>

        {/* Screen carousel */}
        <div className="relative w-full h-full bg-[#1A1A1A] overflow-hidden rounded-t-[26px]">
          {screens.map((src, index) => (
            <div
              key={src + index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={src}
                alt={`${alt} - screen ${index + 1}`}
                width="320"
                height="640"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots if multiple screens */}
      {screens.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
          {screens.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Show screen ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === activeIndex ? "bg-white w-3" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
