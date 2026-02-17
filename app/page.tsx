"use client"

import React from "react"

import { Header } from "components/Header"
import { SearchBar } from "components/SearchBar"
import { SongCard, SongCardSkeleton } from "components/SongCard"
import { useItunesSearch } from "hooks/useItunesSearch"

/**
 * VibeStream homepage — song discovery with search and pagination.
 *
 * Renders the Header, a debounced SearchBar, and a responsive SongGrid.
 * Loading state shows skeleton cards; error state shows a retry prompt.
 * Pagination controls appear below the grid when searching.
 */
export default function HomePage() {
  const { songs, isLoading, error, page, hasMore, search, nextPage, prevPage } = useItunesSearch()

  const showPagination = !isLoading && !error && songs.length > 0 && (page > 1 || hasMore)

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 20 }, (_, i) => <SongCardSkeleton key={i} />)
            : songs.map((song) => <SongCard key={song.trackId} song={song} />)}
        </div>

        {/* Pagination */}
        {showPagination && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={prevPage}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </button>

            <span className="min-w-[4rem] text-center text-sm text-gray-500 dark:text-gray-400">Page {page}</span>

            <button
              type="button"
              onClick={nextPage}
              disabled={!hasMore}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Next
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
