import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(theme)
  }
}

/**
 * Zustand store for theme preference.
 * Persists to localStorage under "vibe-stream-theme".
 * Applies the .dark/.light class to <html> whenever theme changes.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",

      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },

      toggle: () => {
        const next = get().theme === "dark" ? "light" : "dark"
        applyTheme(next)
        set({ theme: next })
      },
    }),
    {
      name: "vibe-stream-theme",
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    }
  )
)
