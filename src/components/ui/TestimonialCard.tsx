import React from "react";
import { Testimonial } from "../../types";
import { Stars } from "./Stars";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
}) => {
  return (
    <div className="w-[280px] sm:w-[340px] md:w-[360px] h-[190px] shrink-0 bg-white border border-border rounded-stat p-5 flex flex-col justify-between text-left transition-all duration-200 hover:shadow-card-soft hover:-translate-y-0.5 select-none">
      <div>
        <Stars count={testimonial.rating} size={14} className="mb-2.5" />
        <p className="font-sans text-[13px] sm:text-[14px] leading-[1.5] text-ink/80 line-clamp-3">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-border/60">
        <div className="w-8 h-8 rounded-full bg-mint-100 flex items-center justify-center text-green-700 font-heading font-bold text-[13px] shrink-0">
          {testimonial.avatarLetter}
        </div>
        <div className="overflow-hidden">
          <p className="font-sans font-semibold text-[13px] text-ink leading-tight truncate">
            {testimonial.name}
          </p>
          <p className="font-sans text-[12px] text-grey-500 leading-tight truncate">
            {testimonial.location}
          </p>
        </div>
      </div>
    </div>
  );
};
