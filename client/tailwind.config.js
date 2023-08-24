/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: [
      {
        olorenlight: {
          primary: "#1D62E7",
          secondary: "#6943D8",
          accent: "#48DB72",
          neutral: "#ECECEC",
          "base-100": "#FFFFFF",
          info: "#D5D5D5",
          success: "#48DB72",
          warning: "#FBBD23",
          error: "#F94F4F",
        },
      },
    ],
  },
  theme: {
    extend: {},
    fontFamily: {
      sans: ['"Rubik"', "sans-serif"],
      body: ["Rubik", "sans-serif"],
      display: ["Cabin", "sans-serif"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('@tailwindcss/forms'),
    require("daisyui")],
};

