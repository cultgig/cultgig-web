import React from "react";
import { FaqItem } from "../../types";

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
}) => {
  const contentId = `faq-content-${item.id}`;
  const headerId = `faq-header-${item.id}`;

  return (
    <div className="bg-white border border-border rounded-faq transition-colors duration-150 overflow-hidden">
      <h3>
        <button
          id={headerId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="w-full py-4 px-5 sm:px-6 flex items-center justify-between gap-4 text-left font-sans font-semibold text-[15px] sm:text-[16px] text-ink hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-inset"
        >
          <span className="leading-snug">{item.question}</span>
          <svg
            className={`w-5 h-5 text-grey-500 shrink-0 transition-transform duration-200 ${
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
      </h3>

      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={`accordion-grid ${isOpen ? "open" : ""}`}
      >
        <div className="accordion-content">
          <div className="px-5 sm:px-6 pb-5 pt-1 text-[14px] sm:text-[15px] leading-[1.65] text-grey-500 font-sans border-t border-border/50">
            {Array.isArray(item.answer) ? (
              <ol className="list-decimal pl-5 space-y-1.5">
                {item.answer.map((ans, idx) => (
                  <li key={idx}>{ans}</li>
                ))}
              </ol>
            ) : (
              <p>{item.answer}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
