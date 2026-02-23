"use client"

import React, { useState } from "react"

import { PlusIcon } from "assets/icons"
import { Header } from "components/Header"
import { PlaylistCard } from "components/playlist/PlaylistCard"
import { usePlaylist } from "hooks/usePlaylist"
import { usePlaylistStore } from "store/usePlaylistStore"

export default function PlaylistsPage() {
  const playlists = usePlaylistStore((s) => s.playlists)
  const { isLoading, create } = usePlaylist()
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
    setNewName("")
    setIsCreating(false)
  }

  return (
    <div className="min-h-screen bg-[--bg-primary]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[--text-primary]">My Playlists</h1>
          {!isCreating && (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              <PlusIcon className="h-4 w-4" />
              New Playlist
            </button>
          )}
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {isCreating && (
          <div className="mb-6 flex gap-2">
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
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false)
                setNewName("")
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-16">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading playlists...</p>
          </div>
        )}

        {!isLoading && playlists.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No playlists yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create one to get started!</p>
          </div>
        )}

        {!isLoading && playlists.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
