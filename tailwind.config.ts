import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
        },
        muted: "var(--muted)",
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },
        arc: {
          red: "var(--red)",
          "red-soft": "var(--red-soft)",
          green: "var(--green)",
          "green-soft": "var(--green-soft)",
          amber: "var(--amber)",
          "amber-soft": "var(--amber-soft)",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,18,32,0.04), 0 1px 3px rgba(11,18,32,0.06)",
        cardHover: "0 4px 12px rgba(11,18,32,0.08), 0 2px 4px rgba(11,18,32,0.06)",
        ring: "0 0 0 3px rgba(207,17,45,0.15)",
      },
      borderRadius: {
        xl2: "0.875rem",
      },
      fontSize: {
        "2xs": "0.6875rem",
      },
    },
  },
  plugins: [],
};
export default config;
