/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // dark only when a logged-in user turns it on
  theme: {
    extend: {
      screens: { xs: "400px" },
      // corners stay between 4px and 8px across the app; "full" is kept for true circles only
      borderRadius: {
        sm: "4px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "8px",
        "2xl": "8px",
        "3xl": "8px",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "sheet-up": { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        "pop-in": {
          from: { opacity: 0, transform: "scale(.96) translateY(4px)" },
          to: { opacity: 1, transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in .2s ease-out",
        "sheet-up": "sheet-up .3s cubic-bezier(.32,.72,0,1)",
        "pop-in": "pop-in .18s ease-out",
      },
    },
  },
  plugins: [],
};
