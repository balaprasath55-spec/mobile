import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2A4A",
          50: "#EEF1F6",
          100: "#D5DCE8",
          200: "#AAB9D1",
          300: "#7F96BA",
          400: "#5473A3",
          500: "#1B2A4A",
          600: "#16223C",
          700: "#111A2E",
          800: "#0C1120",
          900: "#070912",
        },
        accent: {
          DEFAULT: "#2E6FDB",
          50: "#EAF1FB",
          100: "#D0E0F7",
          200: "#A1C1EF",
          300: "#72A2E7",
          400: "#4383DF",
          500: "#2E6FDB",
          600: "#2459AF",
          700: "#1B4383",
          800: "#122C58",
          900: "#09162C",
        },
        ink: "#0F1420",
        muted: "#5B6472",
        surface: "#F7F8FA",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
