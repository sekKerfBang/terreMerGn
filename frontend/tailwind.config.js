/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#eef8f3", 100: "#d6f0e6", 200: "#a9dfcd", 300: "#6cc7a9",
          400: "#2fae85", 500: "#128a66", 600: "#0d6b4f", 700: "#0a513c",
          800: "#07402f", 900: "#052e23",
        },
        lagune: {
          50: "#f7fee7", 100: "#ecfccb", 200: "#d9f99d", 300: "#bef264",
          400: "#a3e635", 500: "#84cc16", 600: "#65a30d", 700: "#4d7c0f",
          800: "#3f6212", 900: "#365314",
        },
        terre: {
          50: "#fff8ed", 100: "#ffefd4", 200: "#ffdba8", 300: "#ffc071",
          400: "#ff9c38", 500: "#fe7d11", 600: "#ef6007", 700: "#c74808",
          800: "#9e390f", 900: "#803110",
        },
        encre: "#14201b",
        sable: "#f5f7f4",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Manrope", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(20, 32, 27, 0.06)",
        lift: "0 12px 32px rgba(20, 32, 27, 0.14)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "slide-in": {
          from: { opacity: 0, transform: "translateY(-8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.85)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease both",
        "fade-in": "fade-in 0.3s ease both",
        "slide-in": "slide-in 0.25s ease both",
        pop: "pop 0.2s ease both",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};





// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       colors: {
//         ocean: {
//           50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc",
//           400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1",
//           800: "#075985", 900: "#0c4a6e", 950: "#082f49",
//         },
//         lagune: {
//           50: "#ecfdf5", 100: "#d1fae5", 300: "#6ee7b7", 500: "#10b981",
//           600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b",
//         },
//         terre: {
//           50: "#fff7ed", 100: "#ffedd5", 300: "#fdba74", 500: "#f97316",
//           600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12",
//         },
//         sable: {
//           50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 500: "#eab308",
//         },
//         encre: "#0f172a",
//       },
//       fontFamily: {
//         sans: ["Inter", "system-ui", "sans-serif"],
//         display: ['"Plus Jakarta Sans"', "Inter", "sans-serif"],
//       },
//       boxShadow: {
//         soft: "0 2px 8px -2px rgb(15 23 42 / 0.08), 0 4px 12px -4px rgb(15 23 42 / 0.06)",
//         card: "0 4px 20px -4px rgb(15 23 42 / 0.10)",
//         glow: "0 0 0 4px rgb(14 165 233 / 0.15)",
//       },
//       animation: {
//         "fade-up": "fadeUp .4s ease-out",
//         "slide-in": "slideIn .3s ease-out",
//       },
//       keyframes: {
//         fadeUp: { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
//         slideIn: { "0%": { opacity: 0, transform: "translateX(-8px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
//       },
//     },
//   },
//   plugins: [],
// };