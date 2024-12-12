// components/Spinner.tsx
import React from "react";

export const Spinner: React.FC = () => {
  return (
    <svg
      className="w-6 h-6 text-white animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="#e5e7eb"
        strokeWidth="10"
        className="opacity-25"
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        className="opacity-75"
        strokeDasharray="283"
        strokeDashoffset="75"
      />
    </svg>
  );
};
