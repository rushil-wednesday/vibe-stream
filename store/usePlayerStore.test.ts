import { describe, expect, it, beforeEach } from "vitest"

import { usePlayerStore } from "./usePlayerStore"
import type { ITunesSong } from "types/itunes"

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

describe("usePlayerStore", () => {
  beforeEach(() => {
    usePlayerStore.setState({
      currentSong: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
      volume: 1,
      queue: [],
    })
  })

  it("starts with no song and not playing", () => {
    const state = usePlayerStore.getState()
    expect(state.currentSong).toBeNull()
    expect(state.isPlaying).toBe(false)
  })

  it("play() sets currentSong and isPlaying=true", () => {
    usePlayerStore.getState().play(mockSong)
    const state = usePlayerStore.getState()
    expect(state.currentSong?.trackId).toBe(42)
    expect(state.isPlaying).toBe(true)
    expect(state.progress).toBe(0)
  })

  it("play() same song resumes without resetting progress", () => {
    usePlayerStore.setState({ currentSong: mockSong, isPlaying: false, progress: 0.5 })
    usePlayerStore.getState().play(mockSong)
    expect(usePlayerStore.getState().progress).toBe(0.5)
    expect(usePlayerStore.getState().isPlaying).toBe(true)
  })

  it("pause() sets isPlaying=false", () => {
    usePlayerStore.setState({ currentSong: mockSong, isPlaying: true })
    usePlayerStore.getState().pause()
    expect(usePlayerStore.getState().isPlaying).toBe(false)
  })

  it("resume() sets isPlaying=true when song loaded", () => {
    usePlayerStore.setState({ currentSong: mockSong, isPlaying: false })
    usePlayerStore.getState().resume()
    expect(usePlayerStore.getState().isPlaying).toBe(true)
  })

  it("seek() clamps progress to 0–1", () => {
    usePlayerStore.getState().seek(1.5)
    expect(usePlayerStore.getState().progress).toBe(1)
    usePlayerStore.getState().seek(-0.1)
    expect(usePlayerStore.getState().progress).toBe(0)
  })

  it("setVolume() clamps volume to 0–1", () => {
    usePlayerStore.getState().setVolume(2)
    expect(usePlayerStore.getState().volume).toBe(1)
    usePlayerStore.getState().setVolume(-1)
    expect(usePlayerStore.getState().volume).toBe(0)
  })

  it("reset() clears all state", () => {
    usePlayerStore.setState({ currentSong: mockSong, isPlaying: true, progress: 0.8, duration: 30 })
    usePlayerStore.getState().reset()
    const state = usePlayerStore.getState()
    expect(state.currentSong).toBeNull()
    expect(state.isPlaying).toBe(false)
    expect(state.progress).toBe(0)
  })

  it("setQueue() replaces the queue", () => {
    const song2: ITunesSong = { ...mockSong, trackId: 99, trackName: "Song 2" }
    usePlayerStore.getState().setQueue([mockSong, song2])
    expect(usePlayerStore.getState().queue).toHaveLength(2)
    expect(usePlayerStore.getState().queue[0]?.trackId).toBe(42)
    expect(usePlayerStore.getState().queue[1]?.trackId).toBe(99)
  })

  it("playNext() shifts first song from queue and plays it", () => {
    const song2: ITunesSong = { ...mockSong, trackId: 99, trackName: "Song 2" }
    usePlayerStore.setState({ queue: [mockSong, song2] })
    usePlayerStore.getState().playNext()
    const state = usePlayerStore.getState()
    expect(state.currentSong?.trackId).toBe(42)
    expect(state.isPlaying).toBe(true)
    expect(state.progress).toBe(0)
    expect(state.queue).toHaveLength(1)
    expect(state.queue[0]?.trackId).toBe(99)
  })

  it("playNext() does nothing when queue is empty", () => {
    usePlayerStore.setState({ currentSong: mockSong, isPlaying: true, queue: [] })
    usePlayerStore.getState().playNext()
    expect(usePlayerStore.getState().currentSong?.trackId).toBe(42)
    expect(usePlayerStore.getState().isPlaying).toBe(true)
  })

  it("clearQueue() empties the queue", () => {
    usePlayerStore.setState({ queue: [mockSong] })
    usePlayerStore.getState().clearQueue()
    expect(usePlayerStore.getState().queue).toEqual([])
  })

  it("reset() also clears the queue", () => {
    usePlayerStore.setState({ currentSong: mockSong, queue: [mockSong] })
    usePlayerStore.getState().reset()
    expect(usePlayerStore.getState().queue).toEqual([])
  })
})
