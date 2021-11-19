module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      width: {
        screen: "99.5vw",
      },
      colors: {
        bglightprimary: "#3736AA",
        blue: {
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
