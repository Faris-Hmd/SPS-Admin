import React from "react";

export function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Processor Frame */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        className="stroke-current"
        strokeWidth="2"
      />

      {/* Admin Shield Core */}
      <path
        d="M12 7L16 8.5V11.5C16 13.8 14.3 15.9 12 16.5C9.7 15.9 8 13.8 8 11.5V8.5L12 7Z"
        className="fill-current"
      />

      {/* Authority Tick inside Shield */}
      <path
        d="M10.5 12L11.5 13L13.5 11"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data Transmission Paths */}
      <path
        d="M12 3V5M12 19V21M3 12H5M19 12H21"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
