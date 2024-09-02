import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      'purple': '#6238F1',
      'lightblue': 'rgb(239 246 255)',
      'yellow': '#F9D351',
      'black': '#000000',
      'white': '#FFFFFF',
      'lightgray': 'rgb(107 114 128)',
      'lightpurple': '#ED3EF7',
      'indigo' : 'rgb(99 102 241)',
      'mediumpurple' : 'rgb(168 85 247)',
      'pink' : 'rgb(236 72 153)'
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config