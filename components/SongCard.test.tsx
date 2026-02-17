import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { SongCard, SongCardSkeleton } from "./SongCard"
import type { ITunesSong } from "types/itunes"

// TODO: mock usePlayerStore to isolate from Zustand
vi.mock("store/usePlayerStore", () => ({
  usePlayerStore: vi.fn((selector) =>
    selector({
      currentSong: null,
      isPlaying: false,
      play: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
    })
  ),
}))

const mockSong: ITunesSong = {
  trackId: 1,
  trackName: "Test Song",
  artistName: "Test Artist",
  collectionName: "Test Album",
  previewUrl: "https://example.com/preview.m4a",
  artworkUrl100: "https://example.com/artwork100.jpg",
  wrapperType: "track",
  kind: "song",
}

describe("SongCard", () => {
  it("renders track name and artist", () => {
    render(<SongCard song={mockSong} />)
    expect(screen.getByText("Test Song")).toBeInTheDocument()
    expect(screen.getByText("Test Artist")).toBeInTheDocument()
  })

  it("has an accessible play button", () => {
    render(<SongCard song={mockSong} />)
    expect(screen.getByRole("button", { name: /play test song/i })).toBeInTheDocument()
  })

  it("responds to Enter and Space keyboard events", () => {
    render(<SongCard song={mockSong} />)
    const card = screen.getByRole("button", { name: /play test song/i })
    fireEvent.keyDown(card, { key: "Enter" })
    fireEvent.keyDown(card, { key: " " })
    // TODO: assert play was called when mock is fully wired
  })
})

describe("SongCardSkeleton", () => {
  it("renders skeleton placeholders", () => {
    const { container } = render(<SongCardSkeleton />)
    // TODO: assert skeleton aria-hidden elements are present
    expect(container.firstChild).toBeInTheDocument()
  })
})
