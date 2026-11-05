import React, { useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

interface NavDropdownProps {
  label: string;
  items: Array<{ id: string; name: string; href?: string }>;
  viewAllText: string;
  viewAllHref: string;
  columns?: 2 | 3;
  onItemClick?: (id: string) => void;
}

export const NavDropdown: React.FC<NavDropdownProps> = ({
  label,
  items,
  viewAllText,
  viewAllHref,
  columns = 3,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1.5 py-2 text-[14px] font-medium text-ink hover:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-md"
      >
        <span>{label}</span>
        <svg
          className={`w-3.5 h-3.5 text-grey-500 transition-transform duration-150 ${
            isOpen ? "rotate-180 text-green-600" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 transition-all duration-150 origin-top ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white border border-border rounded-stat shadow-dropdown p-5 ${
            columns === 3 ? "w-[560px]" : "w-[360px]"
          }`}
        >
          <div
            className={`grid gap-x-4 gap-y-2 text-[13px] ${
              columns === 3 ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href || "#"}
                onClick={(e) => {
                  if (!item.href || item.href === "#") {
                    e.preventDefault();
                  }
                  onItemClick?.(item.id);
                  setIsOpen(false);
                }}
                className="py-1 px-2 rounded hover:bg-mint-100 hover:text-green-700 transition-colors text-ink/80 truncate block"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <a
              href={viewAllHref}
              onClick={(e) => {
                if (viewAllHref.startsWith("#")) {
                  e.preventDefault();
                  const el = document.querySelector(viewAllHref);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
                setIsOpen(false);
              }}
              className="text-[13px] font-semibold text-green-600 hover:text-green-700 inline-flex items-center gap-1"
            >
              <span>{viewAllText}</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
