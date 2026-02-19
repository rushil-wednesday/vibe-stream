"use client"

import React from "react"

import { ChevronLeftIcon, ChevronRightIcon } from "assets/icons"
import { Header } from "components/Header"
import { SearchBar } from "components/SearchBar"
import { SongCard, SongCardSkeleton } from "components/SongCard"
import { useItunesSearch } from "hooks/useItunesSearch"

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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
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
              <ChevronLeftIcon />
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
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
