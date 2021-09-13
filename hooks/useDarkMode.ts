import { useEffect, useState } from "react";

const useDarkMode = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    typeof window !== "undefined" ? localStorage.theme : "dark"
  );

  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(colorTheme);
    root.classList.add(theme);

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme, colorTheme]);

  return [colorTheme, setTheme];
};

export default useDarkMode as any;
