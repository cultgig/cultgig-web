import React from "react";

interface StarsProps {
  count?: number;
  max?: number;
  size?: number;
  className?: string;
}

export const Stars: React.FC<StarsProps> = ({
  count = 5,
  max = 5,
  size = 14,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1 text-green-600 ${className}`}
      aria-label={`${count} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < count ? "#05AC5F" : "none"}
          stroke="#05AC5F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
};
