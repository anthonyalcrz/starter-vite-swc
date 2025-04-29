import { useState, useEffect } from "react";

export default function ToggleDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check saved preference first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // Otherwise detect system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle Dark Mode"
      className="text-sm text-gray-600 dark:text-gray-300 border px-3 py-2 rounded-md transition duration-300 ease-in-out"
    >
      {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
