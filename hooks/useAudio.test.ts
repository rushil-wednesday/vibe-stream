import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

// Mocks must be declared before the dynamic imports
vi.mock("lib/audio", () => ({
  audio: {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    resume: vi.fn().mockResolvedValue(undefined),
    seek: vi.fn(),
    setVolume: vi.fn(),
    on: vi.fn().mockReturnValue(() => undefined),
    currentTime: 0,
    duration: 30,
    volume: 1,
  },
}))

vi.mock("store/usePlayerStore", () => {
  const subscribers: Array<(state: unknown, prev: unknown) => void> = []
  const state = {
    currentSong: null,
    isPlaying: false,
    volume: 1,
    setProgress: vi.fn(),
    pause: vi.fn(),
    setVolume: vi.fn(),
    seek: vi.fn(),
  }
  const store = vi.fn((selector?: (s: typeof state) => unknown) =>
    typeof selector === "function" ? selector(state) : state
  )
  Object.assign(store, {
    getState: () => state,
    subscribe: vi.fn((cb: (s: unknown, p: unknown) => void) => {
      subscribers.push(cb)
      return () => undefined
    }),
  })
  return { usePlayerStore: store }
})

const { useAudio } = await import("./useAudio")

describe("useAudio", () => {
  it("mounts without throwing", () => {
    expect(() => renderHook(() => useAudio())).not.toThrow()
  })

  it("registers event listeners on mount", async () => {
    const { audio } = await import("lib/audio")
    renderHook(() => useAudio())
    // timeupdate, ended, and volumechange listeners are registered
    expect(vi.mocked(audio.on)).toHaveBeenCalledWith("timeupdate", expect.any(Function))
    expect(vi.mocked(audio.on)).toHaveBeenCalledWith("ended", expect.any(Function))
    expect(vi.mocked(audio.on)).toHaveBeenCalledWith("volumechange", expect.any(Function))
  })

  it("calls audio.setVolume when volume changes in store", async () => {
    // TODO: mutate store volume and assert audio.setVolume called via useEffect
  })

  it("seeks audio element when store progress changes by more than 0.01", async () => {
    // TODO: trigger a user-initiated seek in the store subscription and assert audio.seek called
  })
})
