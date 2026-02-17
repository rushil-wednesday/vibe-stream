import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { MiniPlayer } from "./MiniPlayer"

vi.mock("hooks/useAudio", () => ({ useAudio: vi.fn() }))

const mockState = {
  currentSong: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 1,
  pause: vi.fn(),
  resume: vi.fn(),
  seek: vi.fn(),
  setVolume: vi.fn(),
}

vi.mock("store/usePlayerStore", () => ({
  usePlayerStore: vi.fn((selector) =>
    // MiniPlayer calls usePlayerStore() without a selector, and also with one
    typeof selector === "function" ? selector(mockState) : mockState
  ),
}))

describe("MiniPlayer", () => {
  it("renders nothing when no song is loaded", () => {
    const { container } = render(<MiniPlayer />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders the minimised bar when a song is playing", () => {
    // TODO: set currentSong in mockState and assert track name is visible
  })

  it("expands when the bar is clicked", () => {
    // TODO: set currentSong, click bar, assert expanded panel visible
  })

  it("responds to Enter and Space to expand", () => {
    // TODO: set currentSong, keyDown on bar, assert expanded
  })

  it("calls pause/resume when play button is clicked", () => {
    // TODO: wire mock, click play button, assert store action called
  })

  it("calls seek with adjusted fraction on skip buttons", () => {
    // TODO: expand player, click ±10s buttons, assert seek called
  })

  it("updates volume via slider", () => {
    // TODO: expand player, change slider value, assert setVolume called
  })
})
