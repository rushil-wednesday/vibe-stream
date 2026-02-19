import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

const mockReplace = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

vi.mock("store/useAuthStore", () => ({
  useAuthStore: Object.assign(
    vi.fn((selector: (state: Record<string, unknown>) => unknown) =>
      selector({
        user: null,
        isLoading: false,
      })
    ),
    { getState: vi.fn() }
  ),
}))

const { useRequireAuth } = await import("./useRequireAuth")

describe("useRequireAuth", () => {
  it("redirects to login when user is null and not loading", () => {
    renderHook(() => useRequireAuth())
    expect(mockReplace).toHaveBeenCalledWith("/login")
  })

  it("returns user and isLoading state", () => {
    const { result } = renderHook(() => useRequireAuth())
    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })
})
