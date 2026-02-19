import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

const mockGetSession = vi.fn().mockResolvedValue({ data: { session: null } })
const mockOnAuthStateChange = vi.fn().mockReturnValue({
  data: { subscription: { unsubscribe: vi.fn() } },
})

vi.mock("lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}))

vi.mock("store/useAuthStore", () => ({
  useAuthStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      setUser: vi.fn(),
      setSession: vi.fn(),
      setLoading: vi.fn(),
    })
  ),
}))

const { useAuthListener } = await import("./useAuthListener")

describe("useAuthListener", () => {
  it("calls getSession on mount", () => {
    renderHook(() => useAuthListener())
    expect(mockGetSession).toHaveBeenCalledOnce()
  })

  it("subscribes to onAuthStateChange", () => {
    renderHook(() => useAuthListener())
    expect(mockOnAuthStateChange).toHaveBeenCalled()
  })

  it("unsubscribes on unmount", () => {
    const mockUnsubscribe = vi.fn()
    mockOnAuthStateChange.mockReturnValueOnce({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    })
    const { unmount } = renderHook(() => useAuthListener())
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalledOnce()
  })
})
