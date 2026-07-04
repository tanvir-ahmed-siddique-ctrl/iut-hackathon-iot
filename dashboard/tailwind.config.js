/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#fffdf6",
          100: "#fbf7ec",
          200: "#f3ecdc",
        },
        mist: {
          50: "#f4fbf5",
          100: "#e7f5ea",
          200: "#cfe9d8",
          300: "#a9d8ba",
        },
        ink: {
          900: "#17251f",
          700: "#425249",
          500: "#6e7b72",
        },
        leaf: {
          DEFAULT: "#2f9f6b",
          dark: "#20784f",
          soft: "#dff3e6",
        },
        sun: {
          DEFAULT: "#f2b84b",
          soft: "#fff0c9",
        },
        base: {
          950: "#f8f4e8",
          900: "#f3ecdc",
          800: "#ede4d2",
          700: "#d9cbb5",
          600: "#c9bca6",
        },
        amber: {
          glow: "#ffd875",
          DEFAULT: "#f2b84b",
        },
        teal: {
          glow: "#9ce9bb",
          DEFAULT: "#2f9f6b",
        },
        alertred: "#e9535f",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        spin_slow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulse_glow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
        float_soft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
      },
      animation: {
        "spin-fan": "spin_slow 0.58s linear infinite",
        "pulse-glow": "pulse_glow 2.4s ease-in-out infinite",
        "float-soft": "float_soft 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
