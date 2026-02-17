import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Header } from "./Header"

// TODO: mock useThemeStore so ThemeToggle renders without Zustand context
describe("Header", () => {
  it("renders the VibeStream wordmark (text split across two spans)", () => {
    render(<Header />)
    // "Vibe" and "Stream" are in sibling spans — look for the container text
    const banner = screen.getByRole("banner")
    expect(banner.textContent).toMatch(/vibestream/i)
  })

  it("renders a sticky header landmark", () => {
    render(<Header />)
    expect(screen.getByRole("banner")).toBeInTheDocument()
  })
})
