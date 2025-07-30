import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#F5F7F9",
          dark: "#0F1218",
          primary: "#1A1F2B",
          accent: "#F39200",
          sage: "#90B6A3",
        },
      },
    },
  },
  plugins: [],
};

export default config;
