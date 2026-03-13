import React from "react";

type Size = "sm" | "md" | "lg";

export interface SpinnerProps {
  size?: Size;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span
        className={[
          "block rounded-full border-gray-300 border-t-blue-600 animate-spin",
          "dark:border-gray-600 dark:border-t-blue-400",
          sizeClasses[size],
        ].join(" ")}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default Spinner;
