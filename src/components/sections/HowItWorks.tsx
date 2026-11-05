import React from "react";
import { stepsData } from "../../data/steps";
import { SectionHeading } from "../ui/SectionHeading";
import { StepCard } from "../ui/StepCard";

export const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="w-full bg-ink text-white py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="HOW IT WORKS"
          eyebrowVariant="white"
          title="Simple steps to a cleaner home."
          description="Follow these simple steps to get house help in 15 minutes."
          align="left"
          theme="dark"
        />

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8">
          {stepsData.map((step) => (
            <StepCard key={step.stepNumber} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};
