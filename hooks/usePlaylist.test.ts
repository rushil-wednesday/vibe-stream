import { describe, expect, it, vi, beforeEach } from "vitest"

import { usePlaylistStore } from "store/usePlaylistStore"

// Mock GraphQL functions
vi.mock("lib/graphql/playlists", () => ({
  getPlaylists: vi.fn().mockResolvedValue({ data: [], error: null }),
  createPlaylist: vi.fn(),
  renamePlaylist: vi.fn(),
  deletePlaylist: vi.fn(),
}))

vi.mock("lib/graphql/playlist-songs", () => ({
  getPlaylistSongs: vi.fn(),
  addSongToPlaylist: vi.fn(),
  removeSongFromPlaylist: vi.fn(),
  reorderSong: vi.fn(),
}))

vi.mock("store/useAuthStore", () => ({
  useAuthStore: vi.fn((selector) => selector({ user: null, session: null, isLoading: false, hasPassword: false })),
}))

describe("usePlaylist (store integration)", () => {
  beforeEach(() => {
    usePlaylistStore.setState({ playlists: [], isLoading: true })
  })

  it("store starts with empty playlists", () => {
    expect(usePlaylistStore.getState().playlists).toEqual([])
    expect(usePlaylistStore.getState().isLoading).toBe(true)
  })

  it("store setLoading updates isLoading", () => {
    usePlaylistStore.getState().setLoading(false)
    expect(usePlaylistStore.getState().isLoading).toBe(false)
  })

  it("store addPlaylist prepends new playlist", () => {
    const playlist = {
      id: "test-1",
      user_id: "u1",
      name: "Test",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    }
    usePlaylistStore.getState().addPlaylist(playlist)
    expect(usePlaylistStore.getState().playlists).toHaveLength(1)
    expect(usePlaylistStore.getState().playlists[0]?.name).toBe("Test")
  })
})
