import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "gomf-theme";

function getSystemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialMode() {
  if (typeof window === "undefined") return "system";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return ["light", "dark", "system"].includes(saved) ? saved : "system";
  } catch {
    return "system";
  }
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }
  return context;
}

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedTheme = mode === "system" ? systemTheme : mode;

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (event) => setSystemTheme(event.matches ? "dark" : "light");
    setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener?.("change", updateSystemTheme);
    return () => media.removeEventListener?.("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-bs-theme", resolvedTheme);
    root.dataset.themePreference = mode;
    root.style.colorScheme = resolvedTheme;

    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // The theme still works for this session when storage is unavailable.
    }
  }, [mode, resolvedTheme]);

  const toggleTheme = useCallback(() => {
    setMode((current) => {
      const currentResolved = current === "system" ? getSystemTheme() : current;
      return currentResolved === "dark" ? "light" : "dark";
    });
  }, []);

  const value = useMemo(
    () => ({ mode, resolvedTheme, setMode, toggleTheme }),
    [mode, resolvedTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
