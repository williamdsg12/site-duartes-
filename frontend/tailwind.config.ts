import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: [],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Cabinet Grotesk'", "sans-serif"],
        body: ["'Satoshi'", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0B3C5D",
          hover: "#072A42",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#175C8A",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FFC107",
          hover: "#E0A800",
          foreground: "#0B3C5D",
        },
        surface: {
          DEFAULT: "#F8F9FA",
          hover: "#F1F5F9",
        },
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#0B3C5D",
        background: "#FFFFFF",
        foreground: "#0F172A",
        card: { DEFAULT: "#FFFFFF", foreground: "#0F172A" },
        popover: { DEFAULT: "#FFFFFF", foreground: "#0F172A" },
        muted: { DEFAULT: "#F1F5F9", foreground: "#475569" },
        destructive: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgb(0,0,0,0.04)",
        lift: "0 20px 40px rgb(0,0,0,0.08)",
        cta: "0 10px 30px rgba(255,193,7,0.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
