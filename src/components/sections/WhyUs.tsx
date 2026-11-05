import React from "react";
import { statsData } from "../../data/stats";
import { SectionHeading } from "../ui/SectionHeading";
import { StatCard } from "../ui/StatCard";

export const WhyUs: React.FC = () => {
  return (
    <section
      id="why-us"
      className="w-full bg-grey-50 py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="WHY US?"
          title="No more planning around your house help."
          description="Our team of verified Pronto Professionals are always on time."
          align="left"
          titleClassName="max-w-[560px]"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {statsData.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};
