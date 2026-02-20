import { create } from "zustand"

import type { Playlist } from "types/playlist"

interface PlaylistStoreState {
  playlists: Playlist[]
  isLoading: boolean

  setPlaylists: (playlists: Playlist[]) => void
  addPlaylist: (playlist: Playlist) => void
  removePlaylist: (id: string) => void
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void
  setLoading: (isLoading: boolean) => void
  reset: () => void
}

const INITIAL_STATE = {
  playlists: [] as Playlist[],
  isLoading: true,
}

/**
 * Zustand store for playlist state.
 *
 * Populated by the usePlaylist hook which fetches from Supabase.
 * Not persisted — Supabase is the source of truth.
 */
export const usePlaylistStore = create<PlaylistStoreState>()((set) => ({
  ...INITIAL_STATE,

  setPlaylists: (playlists) => set({ playlists }),

  addPlaylist: (playlist) => set((state) => ({ playlists: [playlist, ...state.playlists] })),

  removePlaylist: (id) => set((state) => ({ playlists: state.playlists.filter((p) => p.id !== id) })),

  updatePlaylist: (id, updates) =>
    set((state) => ({
      playlists: state.playlists.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () => set(INITIAL_STATE),
}))
