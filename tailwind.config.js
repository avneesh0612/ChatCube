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
        lightblue: "#655ce6",
        darkblue: "#3b30e0",
        strongblue:"#271dc0",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
