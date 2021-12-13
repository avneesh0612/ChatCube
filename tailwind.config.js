module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        blue: {
          300: "#4F72C2",
          400: "#89A6FB",
          700: "#1F1E5E",
          800: "#18185A",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
