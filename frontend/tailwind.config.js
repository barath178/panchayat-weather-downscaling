/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orchids: {
          bg: "#080a11",
          subtle: "#0e121d",
          surface: "rgba(16, 21, 34, 0.72)",
          surfaceElevated: "rgba(24, 32, 52, 0.85)",
          card: "rgba(18, 24, 40, 0.65)",
          cardHover: "rgba(26, 35, 58, 0.8)",
          border: "rgba(255, 255, 255, 0.08)",
          borderLight: "rgba(255, 255, 255, 0.15)",
          accent: "#10b981",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "-apple-system", "sans-serif"],
        display: ["Outfit", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "orchids-card": "0 12px 36px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.07)",
        "orchids-glow": "0 0 24px -4px rgba(16, 185, 129, 0.25)",
        "orchids-cyan-glow": "0 0 24px -4px rgba(6, 182, 212, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      gridTemplateColumns: {
        14: "repeat(14, minmax(0, 1fr))",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 180ms ease-out",
      },
    },
  },
  plugins: [],
};
