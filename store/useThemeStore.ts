import { create } from "zustand"
import { persist } from "zustand/middleware"

import { THEME_DARK, THEME_LIGHT, type Theme } from "constants/theme"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove(THEME_LIGHT, THEME_DARK)
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
      theme: THEME_DARK,

      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },

      toggle: () => {
        const next = get().theme === THEME_DARK ? THEME_LIGHT : THEME_DARK
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
