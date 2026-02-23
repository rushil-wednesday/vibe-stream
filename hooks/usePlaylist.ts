"use client"

import { useCallback, useEffect } from "react"

import { MAX_PLAYLISTS_PER_USER, MAX_SONGS_PER_PLAYLIST } from "constants/playlist"
import { addSongToPlaylist, getPlaylistSongs, removeSongFromPlaylist, reorderSong } from "lib/graphql/playlist-songs"
import { createPlaylist, deletePlaylist, getPlaylists, renamePlaylist } from "lib/graphql/playlists"
import { useAuthStore } from "store/useAuthStore"
import { usePlaylistStore } from "store/usePlaylistStore"
import type { ITunesSong } from "types/itunes"
import type { PlaylistSong } from "types/playlist"

/**
 * Hook that orchestrates playlist operations between Supabase and the Zustand store.
 * Fetches playlists on mount when a user is authenticated.
 */
export function usePlaylist(): {
  isLoading: boolean
  create: (name: string) => Promise<{ error: string | null }>
  remove: (playlistId: string) => Promise<{ error: string | null }>
  rename: (playlistId: string, name: string) => Promise<{ error: string | null }>
  addSong: (playlistId: string, song: ITunesSong) => Promise<{ data: PlaylistSong | null; error: string | null }>
  removeSong: (songId: string) => Promise<{ error: string | null }>
  moveSong: (playlistId: string, songId: string, newPosition: number) => Promise<{ error: string | null }>
  fetchSongs: (playlistId: string) => Promise<{ data: PlaylistSong[] | null; error: string | null }>
} {
  const user = useAuthStore((s) => s.user)
  const isLoading = usePlaylistStore((s) => s.isLoading)

  useEffect(() => {
    if (!user) {
      usePlaylistStore.getState().reset()
      return
    }

    async function loadPlaylists(): Promise<void> {
      usePlaylistStore.getState().setLoading(true)
      const { data } = await getPlaylists()
      if (data) {
        usePlaylistStore.getState().setPlaylists(data)
      }
      usePlaylistStore.getState().setLoading(false)
    }

    void loadPlaylists()
  }, [user])

  const create = useCallback(async (name: string): Promise<{ error: string | null }> => {
    const { playlists } = usePlaylistStore.getState()
    if (playlists.length >= MAX_PLAYLISTS_PER_USER) {
      return { error: `Maximum of ${MAX_PLAYLISTS_PER_USER} playlists reached` }
    }

    const { data, error } = await createPlaylist(name)
    if (error || !data) return { error: error ?? "Failed to create playlist" }

    usePlaylistStore.getState().addPlaylist(data)
    return { error: null }
  }, [])

  const remove = useCallback(async (playlistId: string): Promise<{ error: string | null }> => {
    const { error } = await deletePlaylist(playlistId)
    if (error) return { error }

    usePlaylistStore.getState().removePlaylist(playlistId)
    return { error: null }
  }, [])

  const rename = useCallback(async (playlistId: string, name: string): Promise<{ error: string | null }> => {
    const { data, error } = await renamePlaylist(playlistId, name)
    if (error || !data) return { error: error ?? "Failed to rename" }

    usePlaylistStore.getState().updatePlaylist(playlistId, { name: data.name, updated_at: data.updated_at })
    return { error: null }
  }, [])

  const addSong = useCallback(
    async (playlistId: string, song: ITunesSong): Promise<{ data: PlaylistSong | null; error: string | null }> => {
      const { data: songs } = await getPlaylistSongs(playlistId)
      if (songs && songs.length >= MAX_SONGS_PER_PLAYLIST) {
        return { data: null, error: `Maximum of ${MAX_SONGS_PER_PLAYLIST} songs per playlist reached` }
      }

      return addSongToPlaylist(playlistId, song)
    },
    []
  )

  const removeSong = useCallback(async (songId: string): Promise<{ error: string | null }> => {
    return removeSongFromPlaylist(songId)
  }, [])

  const moveSong = useCallback(
    async (playlistId: string, songId: string, newPosition: number): Promise<{ error: string | null }> => {
      return reorderSong(playlistId, songId, newPosition)
    },
    []
  )

  const fetchSongs = useCallback(
    async (playlistId: string): Promise<{ data: PlaylistSong[] | null; error: string | null }> => {
      return getPlaylistSongs(playlistId)
    },
    []
  )

  return { isLoading, create, remove, rename, addSong, removeSong, moveSong, fetchSongs }
}
