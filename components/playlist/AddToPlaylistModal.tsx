"use client"

import React, { useState } from "react"

import { MusicNoteIcon, PlusIcon } from "assets/icons"
import { usePlaylist } from "hooks/usePlaylist"
import { usePlaylistStore } from "store/usePlaylistStore"
import type { ITunesSong } from "types/itunes"

interface AddToPlaylistModalProps {
  song: ITunesSong
  onClose: () => void
}

export function AddToPlaylistModal({ song, onClose }: AddToPlaylistModalProps) {
  const playlists = usePlaylistStore((s) => s.playlists)
  const { create, addSong } = usePlaylist()
  const [newName, setNewName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    if (!newName.trim()) return
    setError(null)
    const { error: createError } = await create(newName.trim())
    if (createError) {
      setError(createError)
      return
    }
    // The new playlist is prepended, so add song to it
    const newest = usePlaylistStore.getState().playlists[0]
    if (newest) {
      await addSong(newest.id, song)
    }
    onClose()
  }

  async function handleSelect(playlistId: string) {
    setError(null)
    const { error: addError } = await addSong(playlistId, song)
    if (addError) {
      setError(addError)
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Add to Playlist</h2>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        {/* Create new playlist */}
        {isCreating ? (
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Playlist name"
              autoFocus
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="mb-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-violet-600 transition-colors hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-950"
          >
            <PlusIcon className="h-4 w-4" />
            Create new playlist
          </button>
        )}

        {/* Playlist list */}
        <ul className="max-h-60 overflow-y-auto">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <button
                type="button"
                onClick={() => handleSelect(playlist.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MusicNoteIcon className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="truncate text-gray-900 dark:text-gray-100">{playlist.name}</span>
              </button>
            </li>
          ))}
          {playlists.length === 0 && !isCreating && (
            <li className="px-3 py-2 text-sm text-gray-500">No playlists yet</li>
          )}
        </ul>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
