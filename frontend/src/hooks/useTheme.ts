import { create } from "zustand";

interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  darkMode: localStorage.getItem("theme") === "dark",
  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.darkMode;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return { darkMode: newMode };
    }),
}));
