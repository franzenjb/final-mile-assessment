import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        arc: {
          red: "#ED1B2E",
          dark: "#1F2937",
          ink: "#0B1220",
          blue: "#1E5C8B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
