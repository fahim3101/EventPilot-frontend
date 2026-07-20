import type { Config } from "tailwindcss";

// Global design rule: max 3 primary colors + 1 neutral.
// primary   = deep indigo (brand / CTAs)
// accent    = warm amber (highlights, badges, hover states)
// secondary = teal (secondary actions, success states)
// neutral   = slate (text, backgrounds, borders)
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4338CA",
          50: "#EEF0FC",
          100: "#DCE0F9",
          500: "#4338CA",
          600: "#372DB0",
          700: "#2B2389",
        },
        accent: {
          DEFAULT: "#F59E0B",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
        },
        secondary: {
          DEFAULT: "#0D9488",
          100: "#CCFBF1",
          500: "#0D9488",
          600: "#0F766E",
        },
      },
      borderRadius: {
        card: "1rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
