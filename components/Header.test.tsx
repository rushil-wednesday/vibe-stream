import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

let mockUser: { id: string } | null = null

vi.mock("store/useAuthStore", () => ({
  useAuthStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      user: mockUser,
      isLoading: false,
    })
  ),
}))

const { Header } = await import("./Header")

// TODO: mock useThemeStore so ThemeToggle renders without Zustand context
describe("Header", () => {
  it("renders the VibeStream wordmark (text split across two spans)", () => {
    render(<Header />)
    const banner = screen.getByRole("banner")
    expect(banner.textContent).toMatch(/vibestream/i)
  })

  it("renders a sticky header landmark", () => {
    render(<Header />)
    expect(screen.getByRole("banner")).toHaveClass("sticky")
  })

  it("does not show Playlists link when not authenticated", () => {
    mockUser = null
    render(<Header />)
    expect(screen.queryByText("Playlists")).not.toBeInTheDocument()
  })

  it("shows Playlists link when authenticated", () => {
    mockUser = { id: "user-1" }
    render(<Header />)
    expect(screen.getByText("Playlists")).toBeInTheDocument()
  })
})
