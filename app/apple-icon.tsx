import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata - Apple Touch Icon standard is 180x180
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#020617", // Matches your Slate-950 theme
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "40px", // Rounded corners for iOS home screen
      }}
    >
      <div
        style={{
          background: "linear-gradient(to bottom right, #3b82f6, #1d4ed8)",
          width: "88%",
          height: "88%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
        >
          {/* Admin Processor Frame */}
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="4"
            stroke="white"
            strokeWidth="2"
          />

          {/* Admin Shield Core */}
          <path
            d="M12 7L16 8.5V11.5C16 13.8 14.3 15.9 12 16.5C9.7 15.9 8 13.8 8 11.5V8.5L12 7Z"
            fill="white"
          />

          {/* Verification Mark inside Shield */}
          <path
            d="M10.5 12L11.5 13L13.5 11"
            stroke="#1d4ed8" // Matches the dark blue gradient depth
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Critical Data Paths */}
          <path
            d="M12 3V5M12 19V21M3 12H5M19 12H21"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Diagonal Logic Interconnects */}
          <path
            d="M7 7L8.5 8.5M15.5 15.5L17 17M17 7L15.5 8.5M8.5 15.5L7 17"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ opacity: 0.4 }}
          />
        </svg>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
