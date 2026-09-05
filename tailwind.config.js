/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#0A0E14",
          900: "#0F141C",
          850: "#141B26",
          800: "#1A2331",
          700: "#242F40",
          600: "#374357",
          500: "#5B6779",
          400: "#8792A2",
          300: "#B4BCC7",
          200: "#DADEE4",
          100: "#EEF0F3",
          50: "#F7F8FA",
        },
        vital: {
          950: "#0E1F3D",
          900: "#132A52",
          800: "#1B3A70",
          700: "#234A8E",
          600: "#2E5FB0",
          500: "#3F79D6",
          400: "#5F97E8",
          300: "#8FB8F0",
          200: "#C2D8F7",
          100: "#E4EDFB",
        },
        clover: {
          600: "#1E9E7C",
          500: "#26B991",
          400: "#4FD1AD",
          300: "#8FE3C9",
          100: "#E3F9F1",
        },
        amber: {
          600: "#B5730A",
          500: "#DB8F16",
          400: "#F0AA3C",
          100: "#FBEACB",
        },
        coral: {
          600: "#C4432F",
          500: "#E15540",
          400: "#EB7B69",
          100: "#FBE1DC",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 20, 28, 0.04), 0 8px 24px -8px rgba(15, 20, 28, 0.08)",
        lift: "0 4px 12px -4px rgba(15, 20, 28, 0.12), 0 16px 40px -12px rgba(15, 20, 28, 0.14)",
        glow: "0 0 0 1px rgba(63, 121, 214, 0.15), 0 0 32px -4px rgba(63, 121, 214, 0.35)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(12px, -16px)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(0.2,0.6,0.4,1) infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "drift-slow": "drift-slow 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
