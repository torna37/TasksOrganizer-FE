import { useEffect } from "react";
import { create } from "zustand";

type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const storageKey = "vite-ui-theme";

export const useThemeStore = create<ThemeState>((set) => {
  let initialTheme: Theme = "system";
  if (typeof window !== "undefined") {
    initialTheme = (localStorage.getItem(storageKey) as Theme) || "system";
  }
  return {
    theme: initialTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      set({ theme });
    },
  };
});

// Effect to update the document class when theme changes
export function useThemeEffect() {
  const theme = useThemeStore((state) => state.theme);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);
}
