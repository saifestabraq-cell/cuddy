/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Nocturne: a sharp, high-contrast dark blue-grey — not the old
        // low-contrast charcoal. Cooler and deeper, with clearer steps.
        ink: {
          900: "#090B11", // app background (deep blue-black)
          800: "#10131C", // panels
          700: "#171B27", // raised cards
          600: "#222739", // hover / strong border
          500: "#313850", // hairline borders (more visible)
        },
        mist: {
          100: "#F5F7FB", // primary text (crisp)
          200: "#CBD1E0", // secondary text
          300: "#949CB4", // muted text
          400: "#646C86", // disabled
        },
        // Blurple accent — used as fill, line and glow.
        teal: {
          300: "#8E93FF",
          400: "#6E75F5",
          500: "#565CE0",
        },
        violet: {
          300: "#B7A6F0",
          400: "#9B84E8",
        },
        signal: {
          ai: "#B7A6F0", // AI-generated events
          live: "#FF6B8A", // live/recording accent (sharper)
        },
      },
      borderRadius: {
        xl: "10px",
        "2xl": "12px",
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
        soft: "0 1px 2px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(110,117,245,0.35), 0 0 28px rgba(110,117,245,0.18)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)", // gentle ease-out, no bounce
      },
    },
  },
  plugins: [],
};
