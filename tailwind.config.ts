import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#161616",
        paper: "#faf8f3",
        sage: "#6f8065",
        rust: "#b75d3c"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(22, 22, 22, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
