import React from "react";
import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowVariant?: "green" | "white" | "muted";
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
  titleClassName?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  eyebrowVariant = "green",
  title,
  description,
  align = "left",
  theme = "light",
  className = "",
  titleClassName = "",
}) => {
  const isDark = theme === "dark";
  const isCenter = align === "center";

  return (
    <div
      className={`mb-12 md:mb-14 ${
        isCenter ? "text-center max-w-[760px] mx-auto" : "max-w-[680px]"
      } ${className}`}
    >
      {eyebrow && <Eyebrow variant={eyebrowVariant}>{eyebrow}</Eyebrow>}
      <h2
        className={`font-heading font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] leading-[1.05] tracking-[-0.015em] text-balance ${
          isDark ? "text-white" : "text-ink"
        } ${titleClassName}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[16px] sm:text-[18px] leading-[1.6] max-w-[54ch] ${
            isCenter ? "mx-auto" : ""
          } ${isDark ? "text-white/65" : "text-grey-500"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
