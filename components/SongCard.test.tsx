import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { PlayerState } from "store/usePlayerStore"
import { usePlayerStore } from "store/usePlayerStore"
import type { ITunesSong } from "types/itunes"

import { SongCard, SongCardSkeleton } from "./SongCard"

let mockUser: { id: string } | null = null

vi.mock("store/usePlayerStore", () => ({
  usePlayerStore: vi.fn((selector: (state: Partial<PlayerState>) => unknown) =>
    selector({
      currentSong: null,
      isPlaying: false,
      play: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
    })
  ),
}))

vi.mock("store/useAuthStore", () => ({
  useAuthStore: vi.fn((selector) => selector({ user: mockUser })),
}))

vi.mock("components/playlist/AddToPlaylistModal", () => ({
  AddToPlaylistModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="playlist-modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

const mockSong: ITunesSong = {
  trackId: 1,
  trackName: "Test Song",
  artistName: "Test Artist",
  collectionName: "Test Album",
  previewUrl: "https://example.com/preview.m4a",
  artworkUrl100: "https://example.com/artwork100.jpg",
  trackTimeMillis: 210000,
  primaryGenreName: "Pop",
  releaseDate: "2024-01-01T00:00:00Z",
}

const mockPlay = vi.fn()
const mockPause = vi.fn()
const mockResume = vi.fn()

function setMockPlayerState(overrides: Partial<PlayerState> = {}) {
  const state = {
    currentSong: null,
    isPlaying: false,
    play: mockPlay,
    pause: mockPause,
    resume: mockResume,
    ...overrides,
  } as unknown as PlayerState
  vi.mocked(usePlayerStore).mockImplementation(((selector: (state: PlayerState) => unknown) =>
    selector(state)) as typeof usePlayerStore)
}

describe("SongCard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setMockPlayerState()
    mockUser = null
  })

  it("renders track name and artist", () => {
    render(<SongCard song={mockSong} />)
    expect(screen.getByText("Test Song")).toBeInTheDocument()
    expect(screen.getByText("Test Artist")).toBeInTheDocument()
  })

  it("has an accessible play button that is always visible", () => {
    render(<SongCard song={mockSong} />)
    const playButton = screen.getByRole("button", { name: "Play" })
    expect(playButton).toBeInTheDocument()
    expect(playButton).toBeVisible()
  })

  it("shows pause icon when this song is playing", () => {
    setMockPlayerState({ currentSong: mockSong, isPlaying: true })
    render(<SongCard song={mockSong} />)
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument()
  })

  it("shows play icon when a different song is playing", () => {
    setMockPlayerState({ currentSong: { ...mockSong, trackId: 999 }, isPlaying: true })
    render(<SongCard song={mockSong} />)
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument()
  })

  it("calls pause when clicking the button on a playing song", () => {
    setMockPlayerState({ currentSong: mockSong, isPlaying: true })
    render(<SongCard song={mockSong} />)
    fireEvent.click(screen.getByRole("button", { name: "Pause" }))
    expect(mockPause).toHaveBeenCalledOnce()
  })

  it("calls resume when clicking the button on a paused current song", () => {
    setMockPlayerState({ currentSong: mockSong, isPlaying: false })
    render(<SongCard song={mockSong} />)
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    expect(mockResume).toHaveBeenCalledOnce()
  })

  it("calls play when clicking the button on a non-current song", () => {
    setMockPlayerState({ currentSong: null, isPlaying: false })
    render(<SongCard song={mockSong} />)
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    expect(mockPlay).toHaveBeenCalledWith(mockSong)
  })

  it("responds to Enter and Space keyboard events on the card", () => {
    render(<SongCard song={mockSong} />)
    const card = screen.getByRole("button", { name: /play test song/i })
    fireEvent.keyDown(card, { key: "Enter" })
    fireEvent.keyDown(card, { key: " " })
    expect(mockPlay).toHaveBeenCalledTimes(2)
  })

  it("does not show add-to-playlist button when not authenticated", () => {
    render(<SongCard song={mockSong} />)
    expect(screen.queryByRole("button", { name: "Add to playlist" })).not.toBeInTheDocument()
  })

  it("shows add-to-playlist button when authenticated", () => {
    mockUser = { id: "user-1" }
    render(<SongCard song={mockSong} />)
    expect(screen.getByRole("button", { name: "Add to playlist" })).toBeInTheDocument()
  })

  it("opens playlist modal when add button is clicked", () => {
    mockUser = { id: "user-1" }
    render(<SongCard song={mockSong} />)
    fireEvent.click(screen.getByRole("button", { name: "Add to playlist" }))
    expect(screen.getByTestId("playlist-modal")).toBeInTheDocument()
  })
})

describe("SongCardSkeleton", () => {
  it("renders skeleton placeholders", () => {
    const { container } = render(<SongCardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
