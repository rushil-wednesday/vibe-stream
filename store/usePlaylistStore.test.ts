import { beforeEach, describe, expect, it } from "vitest"

import { usePlaylistStore } from "./usePlaylistStore"
import type { Playlist } from "types/playlist"

const mockPlaylist: Playlist = {
  id: "p1",
  user_id: "u1",
  name: "Chill Vibes",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
}

const mockPlaylist2: Playlist = {
  id: "p2",
  user_id: "u1",
  name: "Workout",
  created_at: "2026-01-02T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
}

describe("usePlaylistStore", () => {
  beforeEach(() => {
    usePlaylistStore.setState({ playlists: [], isLoading: true })
  })

  it("starts with empty playlists and loading true", () => {
    const state = usePlaylistStore.getState()
    expect(state.playlists).toEqual([])
    expect(state.isLoading).toBe(true)
  })

  it("setPlaylists() replaces the playlist array", () => {
    usePlaylistStore.getState().setPlaylists([mockPlaylist, mockPlaylist2])
    expect(usePlaylistStore.getState().playlists).toHaveLength(2)
  })

  it("addPlaylist() prepends to the list", () => {
    usePlaylistStore.getState().setPlaylists([mockPlaylist2])
    usePlaylistStore.getState().addPlaylist(mockPlaylist)
    const playlists = usePlaylistStore.getState().playlists
    expect(playlists[0]?.id).toBe("p1")
    expect(playlists[1]?.id).toBe("p2")
  })

  it("removePlaylist() filters by id", () => {
    usePlaylistStore.getState().setPlaylists([mockPlaylist, mockPlaylist2])
    usePlaylistStore.getState().removePlaylist("p1")
    const playlists = usePlaylistStore.getState().playlists
    expect(playlists).toHaveLength(1)
    expect(playlists[0]?.id).toBe("p2")
  })

  it("updatePlaylist() merges partial updates", () => {
    usePlaylistStore.getState().setPlaylists([mockPlaylist])
    usePlaylistStore.getState().updatePlaylist("p1", { name: "Updated Name" })
    expect(usePlaylistStore.getState().playlists[0]?.name).toBe("Updated Name")
  })

  it("reset() restores initial state", () => {
    usePlaylistStore.getState().setPlaylists([mockPlaylist])
    usePlaylistStore.getState().setLoading(false)
    usePlaylistStore.getState().reset()
    const state = usePlaylistStore.getState()
    expect(state.playlists).toEqual([])
    expect(state.isLoading).toBe(true)
  })
})
