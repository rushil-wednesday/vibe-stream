import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ThemeToggle } from "./ThemeToggle"

// TODO: mock useThemeStore to isolate component from Zustand
vi.mock("store/useThemeStore", () => ({
  useThemeStore: () => ({ theme: "dark", toggle: vi.fn() }),
}))

describe("ThemeToggle", () => {
  it("renders a toggle button", () => {
    render(<ThemeToggle />)
    expect(screen.getByRole("button", { name: /toggle dark mode/i })).toBeInTheDocument()
  })

  it("calls toggle when clicked", () => {
    const toggle = vi.fn()
    vi.mocked(vi.importMock("store/useThemeStore")).useThemeStore = () => ({ theme: "dark", toggle })
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole("button"))
    // TODO: assert toggle was called once store mock is properly wired
  })
})
