import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { ITunesSong } from "types/itunes"

import { MiniPlayer } from "./MiniPlayer"

// Radix UI Slider uses ResizeObserver which is not available in jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.mock("hooks/useAudio", () => ({ useAudio: vi.fn() }))

const mockSong: ITunesSong = {
  trackId: 42,
  trackName: "Shake It Off",
  artistName: "Taylor Swift",
  collectionName: "1989",
  previewUrl: "https://example.com/preview.m4a",
  artworkUrl100: "https://example.com/art.jpg",
  trackTimeMillis: 219000,
  primaryGenreName: "Pop",
  releaseDate: "2014-10-27T00:00:00Z",
}

const queueSong: ITunesSong = {
  trackId: 99,
  trackName: "Blank Space",
  artistName: "Taylor Swift",
  collectionName: "1989",
  previewUrl: "https://example.com/preview2.m4a",
  artworkUrl100: "https://example.com/art2.jpg",
  trackTimeMillis: 231000,
  primaryGenreName: "Pop",
  releaseDate: "2014-10-27T00:00:00Z",
}

let mockState = {
  currentSong: null as ITunesSong | null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 1,
  queue: [] as ITunesSong[],
  pause: vi.fn(),
  resume: vi.fn(),
  seek: vi.fn(),
  setVolume: vi.fn(),
}

vi.mock("store/usePlayerStore", () => ({
  usePlayerStore: vi.fn((selector) => (typeof selector === "function" ? selector(mockState) : mockState)),
}))

describe("MiniPlayer", () => {
  beforeEach(() => {
    mockState = {
      currentSong: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
      volume: 1,
      queue: [],
      pause: vi.fn(),
      resume: vi.fn(),
      seek: vi.fn(),
      setVolume: vi.fn(),
    }
  })

  it("renders nothing when no song is loaded", () => {
    const { container } = render(<MiniPlayer />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders the minimised bar when a song is playing", () => {
    mockState.currentSong = mockSong
    render(<MiniPlayer />)
    expect(screen.getByText("Shake It Off")).toBeDefined()
    expect(screen.getByText("Taylor Swift")).toBeDefined()
  })

  it("does not show Up Next when queue is empty", () => {
    mockState.currentSong = mockSong
    render(<MiniPlayer />)
    fireEvent.click(screen.getByRole("button", { name: "Expand player" }))
    expect(screen.queryByText("Up Next")).toBeNull()
  })

  it("shows Up Next section when queue has songs", () => {
    mockState.currentSong = mockSong
    mockState.queue = [queueSong]
    render(<MiniPlayer />)
    fireEvent.click(screen.getByRole("button", { name: "Expand player" }))
    expect(screen.getByText("Up Next")).toBeDefined()
    expect(screen.getByText("Blank Space")).toBeDefined()
  })

  it("limits Up Next to QUEUE_DISPLAY_COUNT songs", () => {
    mockState.currentSong = mockSong
    mockState.queue = Array.from({ length: 8 }, (_, i) => ({
      ...queueSong,
      trackId: i + 100,
      trackName: `Song ${i + 1}`,
    }))
    render(<MiniPlayer />)
    fireEvent.click(screen.getByRole("button", { name: "Expand player" }))
    expect(screen.getByText("Song 1")).toBeDefined()
    expect(screen.getByText("Song 5")).toBeDefined()
    expect(screen.queryByText("Song 6")).toBeNull()
  })
})
