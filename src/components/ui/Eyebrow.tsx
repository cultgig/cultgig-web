import React from "react";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  variant?: "green" | "white" | "muted";
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  className = "",
  variant = "green",
}) => {
  const colorMap = {
    green: "text-green-600",
    white: "text-green-600", // in screenshot, "HOW IT WORKS" eyebrow is bright emerald green!
    muted: "text-grey-500",
  };

  return (
    <p
      className={`text-[12px] font-semibold tracking-[0.14em] uppercase font-sans mb-3 select-none ${colorMap[variant]} ${className}`}
    >
      {children}
    </p>
  );
};
