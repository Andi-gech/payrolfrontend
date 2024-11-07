// useDarkSide.js
import { useEffect, useState } from "react";

export default function useDarkSide() {
  // Get the initial theme from localStorage or set to light
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove the opposite theme class and apply the current theme class
    root.classList.remove(theme === "dark" ? "light" : "dark");
    root.classList.add(theme);

    // Save the theme to localStorage for persistence
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return [theme, toggleTheme];
}
