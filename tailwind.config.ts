import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{json,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8ecff",
          500: "#0f8fff",
          700: "#0a4fa8",
          900: "#092d5b"
        }
      }
    }
  },
  plugins: []
};

export default config;
