import React, { useEffect, useState } from "react";
import { servicesData } from "../../data/services";
import { citiesData } from "../../data/cities";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [citiesExpanded, setCitiesExpanded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavClick = (hash: string) => {
    onClose();
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 top-[64px] z-50 bg-white/95 backdrop-blur-md overflow-y-auto p-6 flex flex-col gap-6"
    >
      <nav className="flex flex-col gap-4 text-[16px] font-medium text-ink">
        <a
          href="#why-us"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#why-us");
          }}
          className="py-2 border-b border-border hover:text-green-600"
        >
          Why us
        </a>

        {/* Services Accordion */}
        <div className="border-b border-border pb-2">
          <button
            type="button"
            onClick={() => setServicesExpanded(!servicesExpanded)}
            className="w-full py-2 flex items-center justify-between text-left font-medium hover:text-green-600"
          >
            <span>Services</span>
            <svg
              className={`w-4 h-4 text-grey-500 transition-transform ${
                servicesExpanded ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {servicesExpanded && (
            <div className="grid grid-cols-2 gap-2 pt-2 pb-3 pl-2 text-[14px] text-grey-500">
              {servicesData.map((s) => (
                <a
                  key={s.id}
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#services");
                  }}
                  className="py-1 hover:text-green-600 truncate"
                >
                  {s.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Cities Accordion */}
        <div className="border-b border-border pb-2">
          <button
            type="button"
            onClick={() => setCitiesExpanded(!citiesExpanded)}
            className="w-full py-2 flex items-center justify-between text-left font-medium hover:text-green-600"
          >
            <span>Cities</span>
            <svg
              className={`w-4 h-4 text-grey-500 transition-transform ${
                citiesExpanded ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {citiesExpanded && (
            <div className="grid grid-cols-2 gap-2 pt-2 pb-3 pl-2 text-[14px] text-grey-500">
              {citiesData.map((c) => (
                <span key={c.id} className="py-1 text-ink/80">
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <a
          href="#how-it-works"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#how-it-works");
          }}
          className="py-2 border-b border-border hover:text-green-600"
        >
          How it works
        </a>

        <a
          href="#faqs"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#faqs");
          }}
          className="py-2 border-b border-border hover:text-green-600"
        >
          FAQs
        </a>
      </nav>

      <div className="mt-auto pt-6 flex flex-col gap-3">
        <a
          href="https://tally.so/r/rjRabo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center py-3 bg-green-600 text-white rounded-lg font-semibold text-[15px] hover:bg-green-700"
        >
          Request in your locality
        </a>
      </div>
    </div>
  );
};
