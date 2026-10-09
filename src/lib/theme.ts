"use client";

// Dark / light theme. The choice is saved in localStorage and applied as
// <html data-theme="dark|light"> (an inline script in layout.tsx sets it before first paint).
import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
const KEY = "utopia.theme";
const listeners = new Set<() => void>();

export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* storage unavailable: theme still applies for this visit */
  }
  listeners.forEach((l) => l());
}

export function toggleTheme() {
  setTheme(getTheme() === "light" ? "dark" : "light");
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getTheme,
    () => "dark",
  );
}
