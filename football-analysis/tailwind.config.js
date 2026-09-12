/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep, soft charcoal surfaces — never pure black.
        ink: {
          900: "#0E0F13", // app background
          800: "#141620", // panels
          700: "#1A1D28", // raised cards
          600: "#232735", // hover / borders-strong
          500: "#2E3342", // hairline borders
        },
        mist: {
          100: "#EAECF2", // primary text
          200: "#C3C7D2", // secondary text
          300: "#8A90A0", // muted text
          400: "#5C6273", // disabled
        },
        // Muted, desaturated accents.
        teal: {
          300: "#6EE7D6",
          400: "#39C9B6",
          500: "#2BA593",
        },
        violet: {
          300: "#B7A6F0",
          400: "#9B84E8",
        },
        signal: {
          ai: "#B7A6F0", // AI-generated events
          live: "#F0A6C0", // live/recording accent
        },
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.25)",
        glow: "0 0 0 1px rgba(110,231,214,0.15), 0 0 24px rgba(110,231,214,0.08)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)", // gentle ease-out, no bounce
      },
    },
  },
  plugins: [],
};
