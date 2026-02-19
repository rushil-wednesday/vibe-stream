import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("store/useAuthStore", () => ({
  useAuthStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      user: null,
      isLoading: false,
    })
  ),
}))

vi.mock("lib/supabase/client", () => ({
  createClient: () => ({
    auth: { signOut: vi.fn().mockResolvedValue({}) },
  }),
}))

const { Header } = await import("./Header")

describe("Header", () => {
  it("renders the VibeStream wordmark (text split across two spans)", () => {
    render(<Header />)
    // "Vibe" and "Stream" are in sibling spans — look for the container text
    const banner = screen.getByRole("banner")
    expect(banner.textContent).toMatch(/vibestream/i)
  })

  it("renders a sticky header landmark", () => {
    render(<Header />)
    expect(screen.getByRole("banner")).toHaveClass("sticky")
  })
})
