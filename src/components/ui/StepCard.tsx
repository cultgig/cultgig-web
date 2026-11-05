import React from "react";
import { Step } from "../../types";
import { PhoneFrame } from "./PhoneFrame";

interface StepCardProps {
  step: Step;
}

export const StepCard: React.FC<StepCardProps> = ({ step }) => {
  return (
    <div className="flex flex-col max-w-[420px] mx-auto w-full">
      {/* Visual Frame */}
      <div className="mb-6">
        <PhoneFrame screens={step.screens} alt={step.title} />
      </div>

      {/* Copy Block */}
      <div>
        <p className="text-[12px] font-semibold tracking-[0.14em] uppercase text-green-600 font-sans mb-2">
          {step.stepLabel}
        </p>
        <h3 className="font-heading font-semibold text-[22px] sm:text-[24px] lg:text-[26px] leading-[1.15] text-white tracking-[-0.01em] mb-2 text-balance">
          {step.title}
        </h3>
        <p className="font-sans text-[15px] sm:text-[16px] leading-[1.6] text-white/65">
          {step.description}
        </p>
      </div>
    </div>
  );
};
