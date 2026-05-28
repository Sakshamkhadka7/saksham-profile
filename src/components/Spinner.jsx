// ─────────────────────────────────────────────────────────────
//  Spinner.jsx
//  Path: frontend/src/components/Spinner.jsx
//
//  A centered loading spinner shown while API data is being fetched.
//  Props:
//   • message  – optional text below the spinner (default: "Loading...")
//   • darkMode – boolean, passed from ThemeContext to style correctly
// ─────────────────────────────────────────────────────────────

import React from "react";

const Spinner = ({ message = "Loading...", darkMode = true }) => {
  return (
    // Center spinner vertically and horizontally inside its parent section
    <div className="flex flex-col items-center justify-center min-h-[320px] gap-5">

      {/* Outer glow ring */}
      <div className="relative w-14 h-14">

        {/* Static background ring */}
        <div
          className="absolute inset-0 rounded-full border-4"
          style={{
            borderColor: darkMode
              ? "rgba(108,159,255,0.15)"
              : "rgba(61,110,255,0.12)",
          }}
        />

        {/* Spinning ring — only the top border has colour, the rest is transparent */}
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
          style={{
            borderTopColor: "#6c9fff",
            // Smooth out the spin
            animationDuration: "0.75s",
          }}
        />

        {/* Small glowing dot in the centre */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ background: "#6c9fff" }}
          />
        </div>
      </div>

      {/* Optional message below the spinner */}
      <p
        className="text-xs uppercase tracking-widest font-semibold"
        style={{
          color: darkMode
            ? "rgba(108,159,255,0.65)"
            : "rgba(61,110,255,0.6)",
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default Spinner;
