import { describe, expect, it, beforeEach, vi } from "vitest"

// Mock localStorage and matchMedia before importing the store
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
})

// Dynamic import to ensure mocks are set up first
const { useThemeStore } = await import("./useThemeStore")

describe("useThemeStore", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark", "light")
    localStorage.clear()
    useThemeStore.setState({ theme: "dark" })
  })

  it("initialises with dark theme by default", () => {
    expect(useThemeStore.getState().theme).toBe("dark")
  })

  it("setTheme() changes the theme", () => {
    useThemeStore.getState().setTheme("light")
    expect(useThemeStore.getState().theme).toBe("light")
  })

  it("setTheme() applies class to documentElement", () => {
    useThemeStore.getState().setTheme("light")
    expect(document.documentElement.classList.contains("light")).toBe(true)
  })

  it("toggle() switches from dark to light", () => {
    useThemeStore.setState({ theme: "dark" })
    useThemeStore.getState().toggle()
    expect(useThemeStore.getState().theme).toBe("light")
  })

  it("toggle() switches from light to dark", () => {
    useThemeStore.setState({ theme: "light" })
    useThemeStore.getState().toggle()
    expect(useThemeStore.getState().theme).toBe("dark")
  })
})
