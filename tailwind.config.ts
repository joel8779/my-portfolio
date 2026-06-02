import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        exhibit: {
          red: "#C8102E",
          redDark: "#8B0D1F",
          blue: "#1A4A9E",
          blueDark: "#0D2E6B",
          chrome: "#D4D8DE",
          silver: "#B8C0CC",
          muted: "#6B7280",
          dark: "#06080E",
          panel: "#0C1018",
          panel2: "#111827",
          flame: "#FF6B00",
        },
      },
      fontFamily: {
        display: ["var(--font-rajdhani)", "sans-serif"],
        body: ["var(--font-exo)", "sans-serif"],
      },
      boxShadow: {
        exhibit: "0 0 52px rgba(26, 74, 158, 0.18)",
        redline: "0 0 32px rgba(200, 16, 46, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
