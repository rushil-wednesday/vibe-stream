import { renderHook, act, waitFor } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach } from "vitest"

vi.mock("lib/itunes", () => ({
  fetchSongs: vi.fn().mockResolvedValue([]),
  pickDefaultQuery: vi.fn().mockReturnValue("top hits"),
}))

const { useItunesSearch } = await import("./useItunesSearch")

describe("useItunesSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches default songs on mount", async () => {
    const { fetchSongs } = await import("lib/itunes")
    renderHook(() => useItunesSearch())
    await waitFor(() => {
      expect(fetchSongs).toHaveBeenCalledOnce()
    })
  })

  it("resets to page 1 when search query changes", async () => {
    const { result } = renderHook(() => useItunesSearch())
    act(() => result.current.search("Taylor Swift"))
    await waitFor(() => expect(result.current.page).toBe(1))
  })

  it("increments page on nextPage()", async () => {
    const { fetchSongs } = await import("lib/itunes")
    vi.mocked(fetchSongs).mockResolvedValue(
      Array(25)
        .fill(null)
        .map((_, i) => ({ trackId: i }) as any)
    )
    const { result } = renderHook(() => useItunesSearch())
    act(() => result.current.search("rock"))
    await waitFor(() => expect(result.current.hasMore).toBe(true))
    act(() => result.current.nextPage())
    await waitFor(() => expect(result.current.page).toBe(2))
  })

  it("decrements page on prevPage()", async () => {
    const { result } = renderHook(() => useItunesSearch())
    // TODO: navigate to page 2 first, then prevPage, assert page 1
  })

  it("sets hasMore=false when fewer than PAGE_SIZE results returned", async () => {
    const { fetchSongs } = await import("lib/itunes")
    vi.mocked(fetchSongs).mockResolvedValue([{ trackId: 1 } as any])
    const { result } = renderHook(() => useItunesSearch())
    act(() => result.current.search("obscure query"))
    await waitFor(() => expect(result.current.hasMore).toBe(false))
  })

  it("sets error state on fetch failure", async () => {
    const { fetchSongs } = await import("lib/itunes")
    vi.mocked(fetchSongs).mockRejectedValue(new Error("network error"))
    const { result } = renderHook(() => useItunesSearch())
    await waitFor(() => expect(result.current.error).toBe("network error"))
  })
})
