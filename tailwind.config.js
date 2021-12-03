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
        Jaguar: "#1F1D2C",
        Blackish:"#0E011E",
        Purple:"#5E1492",
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
