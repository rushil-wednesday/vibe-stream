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

const { UserMenu } = await import("./UserMenu")

describe("UserMenu", () => {
  it("renders sign-in link when user is not authenticated", () => {
    render(<UserMenu />)
    expect(screen.getByText("Sign in")).toBeInTheDocument()
  })
})
