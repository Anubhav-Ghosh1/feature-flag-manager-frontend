"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useContextStore } from "@/context/Store";

export default function Slider() {
  const { theme, toggleTheme } = useContextStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  let handleToggle = () => {
    let newTheme = theme === "light" ? "dark" : "light";
    toggleTheme(newTheme);
  };
  return (
    <button
      type="button"
      role="switch"
      onClick={() => handleToggle()}
      className={[
        "relative h-7 w-14 cursor-pointer rounded-full transition-colors",
        theme === "light"
          ? "bg-gray-100"
          : "bg-gradient-to-r from-gray-700 via-gray-900 to-black",
        "focus:outline-none focus:ring-2 focus:ring-black/40",
      ].join(" ")}
      aria-label="Toggle dark mode"
    >
      <Sun
        className="absolute left-1 top-1 h-5 w-5 text-yellow-500"
        aria-hidden
      />
      <Moon className="absolute right-1 top-1 h-5 w-5 text-white" aria-hidden />
      <span
        className={[
          "pointer-events-none absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
          theme === "dark" ? "-translate-x-6" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}
