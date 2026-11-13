import { createStore } from "zustand/vanilla"
import type { StoreApi } from "zustand/vanilla"
import type { IThemeStore } from "@/types/theme"

// applies theme changes without rendering executable scripts during navigation.
export const createThemeStore = (): StoreApi<IThemeStore> => {
  return createStore<IThemeStore>()((set) => ({
    theme: "light",
    setTheme: (theme): void => {
      document.documentElement.classList.toggle("dark", theme === "dark")
      document.documentElement.style.colorScheme = theme
      try {
        localStorage.setItem("theme", theme)
      } catch {
        /* retains the theme in memory when storage is unavailable. */
      }
      set({ theme })
    },
  }))
}
