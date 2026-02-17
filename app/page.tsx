"use client"

import React from "react"

import { Header } from "components/Header"
import { SearchBar } from "components/SearchBar"
import { SongCard, SongCardSkeleton } from "components/SongCard"
import { useItunesSearch } from "hooks/useItunesSearch"

/**
 * VibeStream homepage — song discovery with search.
 *
 * Renders the Header, a debounced SearchBar, and a responsive SongGrid.
 * Loading state shows skeleton cards; error state shows a retry prompt.
 */
export default function HomePage() {
  const { songs, isLoading, error, search } = useItunesSearch()

  return (
    <div className="min-h-screen bg-[--bg-primary]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Search */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-[--text-primary]">Discover Music</h1>
          <p className="mb-4 text-sm text-[--text-secondary]">Search songs, artists, or albums</p>
          <SearchBar onSearch={search} isLoading={isLoading} />
        </div>

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Something went wrong</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
            <button
              type="button"
              onClick={() => search("")}
              className="mt-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && songs.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No songs found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Try a different search term</p>
          </div>
        )}

        {/* Song grid */}
        <div className="group grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 20 }, (_, i) => <SongCardSkeleton key={i} />)
            : songs.map((song) => <SongCard key={song.trackId} song={song} />)}
        </div>
      </main>
    </div>
  )
}
