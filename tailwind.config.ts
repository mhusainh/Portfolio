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
        neo: {
          lime: "#E2FF00",
          indigo: "#635BFF",
          coral: "#FF6B35",
          lavender: "#9D93FF",
          charcoal: "#4A4A4A",
          black: "#000000",
          white: "#FFFFFF",
        },
      },
      boxShadow: {
        neo: "4px 4px 0px 0px #000000",
        "neo-sm": "2px 2px 0px 0px #000000",
        "neo-lg": "8px 8px 0px 0px #000000",
        "neo-dark": "4px 4px 0px 0px #FFFFFF",
        "neo-dark-sm": "2px 2px 0px 0px #FFFFFF",
      },
    },
  },
  plugins: [],
};
export default config;
