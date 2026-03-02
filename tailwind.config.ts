import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        /* Estos colores se sobreescriben via CSS variables para los presets */
        surface: {
          DEFAULT: "var(--color-surface)",
          alt: "var(--color-surface-alt)",
          hover: "var(--color-surface-hover)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
          dark: "var(--color-accent-dark)",
        },
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        /* Paleta pastel fija para gráficos y badges */
        pastel: {
          blush: "#f4a7bb",
          mint: "#98d4bb",
          lilac: "#c3a6d8",
          sky: "#8ec5e8",
          peach: "#f7c59f",
          gold: "#f0d789",
          sage: "#b2c9ab",
          coral: "#f08a7e",
        },
      },
      borderRadius: {
        squircle: "1.25rem",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
