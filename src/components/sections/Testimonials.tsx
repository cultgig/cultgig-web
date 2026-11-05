import React from "react";
import { testimonialsRow1, testimonialsRow2 } from "../../data/testimonials";
import { SectionHeading } from "../ui/SectionHeading";
import { TestimonialCard } from "../ui/TestimonialCard";
import { Marquee } from "../ui/Marquee";

export const Testimonials: React.FC = () => {
  return (
    <section
      id="testimonials"
      className="w-full bg-white py-20 sm:py-24 lg:py-28 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10 mb-8 sm:mb-12">
        <SectionHeading
          eyebrow="OUR TESTIMONIALS"
          title="Loved by Pronto homes."
          description="Real reviews from real homes across India."
          align="left"
          className="mb-0"
        />
      </div>

      {/* Two Full-Bleed Marquee Rows */}
      <div className="flex flex-col gap-5 sm:gap-6 w-full">
        {/* Row 1: Leftward infinite marquee */}
        <Marquee direction="left" speed="normal">
          {testimonialsRow1.map((item) => (
            <TestimonialCard key={`row1-${item.id}`} testimonial={item} />
          ))}
        </Marquee>

        {/* Row 2: Leftward slower / offset marquee */}
        <Marquee direction="left" speed="slow">
          {testimonialsRow2.map((item) => (
            <TestimonialCard key={`row2-${item.id}`} testimonial={item} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};
