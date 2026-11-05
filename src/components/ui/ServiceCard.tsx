import React, { useState } from "react";
import { Service } from "../../types";

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (service.href === "#") {
      e.preventDefault();
      // Smooth scroll to hero / tally request link
      const elem = document.querySelector("#hero");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <a
      href={service.href}
      onClick={handleClick}
      aria-label={`View ${service.name}`}
      className="group flex flex-col justify-between bg-white border border-border rounded-card p-3 sm:p-4 transition-all duration-200 hover:-translate-y-1 hover:border-mint-200 hover:shadow-card-soft focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none"
    >
      <div className="w-full aspect-square bg-[#F7F8FA] rounded-[14px] flex items-center justify-center p-2 mb-3 overflow-hidden">
        {!imageFailed ? (
          <img
            src={service.image}
            alt={service.name}
            width="180"
            height="180"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 text-green-600 bg-mint-100/50 rounded-lg">
            <svg
              className="w-8 h-8 mb-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="text-[11px] font-medium text-grey-500">
              {service.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-1 mt-auto pt-1">
        <span className="font-sans font-medium text-[12px] sm:text-[13px] md:text-[14px] leading-tight text-ink group-hover:text-green-700 line-clamp-2">
          {service.name}
        </span>
        <svg
          className="w-4 h-4 text-grey-500 shrink-0 transition-transform duration-200 group-hover:text-green-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>
    </a>
  );
};
