"use client"

import React, { useCallback, useEffect, useState } from "react"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

import { ChevronLeftIcon, PlayIcon, TrashIcon } from "assets/icons"
import { Header } from "components/Header"
import { ARTWORK_SIZE_SMALL } from "constants/player"
import { usePlaylist } from "hooks/usePlaylist"
import { usePlaylistStore } from "store/usePlaylistStore"
import { usePlayerStore } from "store/usePlayerStore"
import { getArtworkUrl } from "types/itunes"
import type { PlaylistSong } from "types/playlist"

export default function PlaylistDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const playlistId = params.id
  const playlist = usePlaylistStore((s) => s.playlists.find((p) => p.id === playlistId))
  const { remove, rename, removeSong, moveSong, fetchSongs } = usePlaylist()
  const play = usePlayerStore((s) => s.play)
  const setQueue = usePlayerStore((s) => s.setQueue)

  const [songs, setSongs] = useState<PlaylistSong[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")

  const loadSongs = useCallback(async () => {
    setIsLoading(true)
    const { data } = await fetchSongs(playlistId)
    if (data) setSongs(data)
    setIsLoading(false)
  }, [fetchSongs, playlistId])

  useEffect(() => {
    void loadSongs()
  }, [loadSongs])

  async function handleRename() {
    if (!editName.trim() || !playlist) return
    await rename(playlistId, editName.trim())
    setIsEditing(false)
  }

  async function handleDelete() {
    await remove(playlistId)
    router.push("/playlists")
  }

  async function handleRemoveSong(songId: string) {
    await removeSong(songId)
    setSongs((prev) => prev.filter((s) => s.id !== songId))
  }

  async function handleMoveSong(songId: string, newPosition: number) {
    await moveSong(playlistId, songId, newPosition)
    await loadSongs()
  }

  function handlePlayAll() {
    if (songs.length === 0) return
    const firstSong = songs[0]
    if (!firstSong) return
    play(firstSong.song_data)
    setQueue(songs.slice(1).map((s) => s.song_data))
  }

  return (
    <div className="min-h-screen bg-[--bg-primary]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Back link */}
        <button
          type="button"
          onClick={() => router.push("/playlists")}
          className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to playlists
        </button>

        {/* Playlist header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename()}
                  autoFocus
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-lg font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={handleRename}
                  className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <h1
                className="cursor-pointer text-2xl font-bold text-[--text-primary] hover:text-violet-600 dark:hover:text-violet-400"
                onClick={() => {
                  setEditName(playlist?.name ?? "")
                  setIsEditing(true)
                }}
                title="Click to rename"
              >
                {playlist?.name ?? "Playlist"}
              </h1>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </p>
          </div>

          <div className="flex gap-2">
            {songs.length > 0 && (
              <button
                type="button"
                onClick={handlePlayAll}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
              >
                <PlayIcon className="h-4 w-4" />
                Play All
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Song list */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading songs...</p>
          </div>
        )}

        {!isLoading && songs.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No songs in this playlist</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Search for songs and add them here</p>
          </div>
        )}

        {!isLoading && songs.length > 0 && (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {songs.map((song, index) => (
              <li key={song.id} className="flex items-center gap-4 py-3">
                <span className="w-6 text-right text-sm text-gray-400 tabular-nums">{index + 1}</span>
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
                  <Image
                    src={getArtworkUrl(song.song_data.artworkUrl100, ARTWORK_SIZE_SMALL)}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {song.song_data.trackName}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{song.song_data.artistName}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveSong(song.id, index - 1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveSong(song.id, index + 1)}
                    disabled={index === songs.length - 1}
                    aria-label="Move down"
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSong(song.id)}
                    aria-label="Remove song"
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
