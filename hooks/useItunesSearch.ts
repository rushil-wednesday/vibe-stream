"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { fetchSongs, pickDefaultQuery } from "lib/itunes"
import type { ITunesSong } from "types/itunes"

const DEBOUNCE_MS = 500
const PAGE_SIZE = 20
/** iTunes API max. Fetch everything at once so client-side pagination is exact. */
const FETCH_LIMIT = 200

interface UseItunesSearchResult {
  songs: ITunesSong[]
  isLoading: boolean
  error: string | null
  page: number
  hasMore: boolean
  /** Call with an empty string to restore default homepage songs */
  search: (query: string) => void
  nextPage: () => void
  prevPage: () => void
}

/**
 * Custom hook: debounced iTunes search with client-side pagination.
 *
 * - Fetches up to FETCH_LIMIT results in a single request (iTunes API max 200)
 * - Slices results into PAGE_SIZE pages entirely on the client — this avoids
 *   the iTunes API's unreliable offset behaviour which returns duplicate pages
 * - 500 ms debounce on the search call to minimise API requests
 * - Uses AbortController to cancel in-flight requests on new input
 * - Reverts to curated default songs when query is cleared
 */
export function useItunesSearch(): UseItunesSearchResult {
  const [allSongs, setAllSongs] = useState<ITunesSong[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const activeQueryRef = useRef<string>("")
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch all results for a query and reset to page 1
  const doFetch = useCallback(async (query: string, signal: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      const results = await fetchSongs(query, FETCH_LIMIT, 0, signal)
      if (!signal.aborted) {
        setAllSongs(results)
        setPage(1)
      }
    } catch (err) {
      if (!signal.aborted) {
        setError(err instanceof Error ? err.message : "Failed to load songs")
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  // Fetch default songs on mount
  useEffect(() => {
    const defaultQuery = pickDefaultQuery()
    activeQueryRef.current = defaultQuery
    const controller = new AbortController()
    abortRef.current = controller
    void doFetch(defaultQuery, controller.signal)
    return () => controller.abort()
  }, [doFetch])

  const search = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (abortRef.current) abortRef.current.abort()

      const resolvedQuery = query.trim() ? query : pickDefaultQuery()
      activeQueryRef.current = resolvedQuery
      setPage(1)

      debounceRef.current = setTimeout(() => {
        const controller = new AbortController()
        abortRef.current = controller
        void doFetch(resolvedQuery, controller.signal)
      }, DEBOUNCE_MS)
    },
    [doFetch]
  )

  // Client-side pagination — no additional fetches needed
  const nextPage = useCallback(() => {
    setPage((prev) => {
      const next = prev + 1
      return next * PAGE_SIZE <= allSongs.length + PAGE_SIZE - 1 ? next : prev
    })
  }, [allSongs.length])

  const prevPage = useCallback(() => {
    setPage((prev) => (prev > 1 ? prev - 1 : 1))
  }, [])

  const songs = allSongs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasMore = page * PAGE_SIZE < allSongs.length

  return { songs, isLoading, error, page, hasMore, search, nextPage, prevPage }
}
