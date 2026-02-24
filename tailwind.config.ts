import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-green": "#00C853",
        "brand-green-dark": "#00A846",
        "brand-green-light": "#E8FFF1",
        "brand-orange": "#FF6D00",
        "brand-orange-dark": "#E56200",
        "brand-orange-light": "#FFF3E8",
        "brand-danger": "#FF3D00",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
      },
      boxShadow: {
        DEFAULT: "0 2px 16px rgba(0, 0, 0, 0.08)",
        lg: "0 8px 40px rgba(0, 0, 0, 0.12)",
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
