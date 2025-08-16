import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Usa las variables que definiste con next/font
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [
    // Si usas shadcn/ui, suele recomendarse:
    require("tailwindcss-animate"),
  ],
} satisfies Config;

export default config;
