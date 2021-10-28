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
        lightblue: "#B1ABFF",
        darkblue: "#3b30e0",
        strongblue: "#271dc0",
        bglightprimary: "#3736AA",
        bgprimary: "#2F2DB6",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
