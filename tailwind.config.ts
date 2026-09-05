import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2f7",
          100: "#dbe3ee",
          200: "#b3c3d9",
          300: "#7f97b8",
          400: "#4d6d97",
          500: "#2c4c74",
          600: "#1c3557",
          700: "#132847",
          800: "#0f2038",
          900: "#0b1f3a",
        },
        gold: {
          50: "#faf6ee",
          100: "#f3e9d3",
          200: "#e6d0a6",
          300: "#d4af72",
          400: "#c6a267",
          500: "#b8965a",
          600: "#9c7c47",
          700: "#7d6339",
          800: "#5f4b2b",
          900: "#41341d",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
