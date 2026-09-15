/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc",
          400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1",
          800: "#075985", 900: "#0c4a6e", 950: "#082f49",
        },
        lagune: {
          50: "#ecfdf5", 100: "#d1fae5", 300: "#6ee7b7", 500: "#10b981",
          600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b",
        },
        terre: {
          50: "#fff7ed", 100: "#ffedd5", 300: "#fdba74", 500: "#f97316",
          600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12",
        },
        sable: {
          50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 500: "#eab308",
        },
        encre: "#0f172a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgb(15 23 42 / 0.08), 0 4px 12px -4px rgb(15 23 42 / 0.06)",
        card: "0 4px 20px -4px rgb(15 23 42 / 0.10)",
        glow: "0 0 0 4px rgb(14 165 233 / 0.15)",
      },
      animation: {
        "fade-up": "fadeUp .4s ease-out",
        "slide-in": "slideIn .3s ease-out",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        slideIn: { "0%": { opacity: 0, transform: "translateX(-8px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};