"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { fetchSongs, pickDefaultQuery } from "lib/itunes"
import type { ITunesSong } from "types/itunes"

const DEBOUNCE_MS = 500
const PAGE_SIZE = 20

interface UseItunesSearchResult {
  songs: ITunesSong[]
  isLoading: boolean
  error: string | null
  page: number
  /** True when the last fetch returned a full page — more results likely exist */
  hasMore: boolean
  /** Call with an empty string to restore default homepage songs */
  search: (query: string) => void
  nextPage: () => void
  prevPage: () => void
}

/**
 * Custom hook: debounced iTunes search with pagination, loading, and error states.
 *
 * - 500 ms debounce on the search call to minimise API requests
 * - Uses AbortController to cancel in-flight requests on new input
 * - Reverts to curated default songs when query is cleared
 * - Exposes nextPage / prevPage for paginating through all results
 * - Default view paginates consistently by storing the picked query for the session
 */
export function useItunesSearch(): UseItunesSearchResult {
  const [songs, setSongs] = useState<ITunesSong[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("")

  // Stores the actual query used for fetching — for empty queries this is the
  // randomly picked default genre so pagination stays consistent within a session
  const activeQueryRef = useRef<string>("")

  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doFetch = useCallback(async (query: string, pageNum: number, signal: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      const offset = (pageNum - 1) * PAGE_SIZE
      // Fetch one extra to detect whether another page exists (look-ahead)
      const results = await fetchSongs(query, PAGE_SIZE + 1, offset, signal)
      if (!signal.aborted) {
        setSongs(results.slice(0, PAGE_SIZE))
        setHasMore(results.length > PAGE_SIZE)
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

  // Fetch default songs on mount using a consistently stored query
  useEffect(() => {
    const defaultQuery = pickDefaultQuery()
    activeQueryRef.current = defaultQuery
    const controller = new AbortController()
    abortRef.current = controller
    void doFetch(defaultQuery, 1, controller.signal)
    return () => controller.abort()
  }, [doFetch])

  const search = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (abortRef.current) abortRef.current.abort()

      // Pick a new default query when clearing the search box
      const resolvedQuery = query.trim() ? query : pickDefaultQuery()
      activeQueryRef.current = resolvedQuery

      // Reset pagination on new query
      setPage(1)
      setCurrentQuery(query)

      debounceRef.current = setTimeout(() => {
        const controller = new AbortController()
        abortRef.current = controller
        void doFetch(resolvedQuery, 1, controller.signal)
      }, DEBOUNCE_MS)
    },
    [doFetch]
  )

  const nextPage = useCallback(() => {
    if (!hasMore) return
    if (abortRef.current) abortRef.current.abort()
    const newPage = page + 1
    setPage(newPage)
    const controller = new AbortController()
    abortRef.current = controller
    void doFetch(activeQueryRef.current, newPage, controller.signal)
  }, [hasMore, page, doFetch])

  const prevPage = useCallback(() => {
    if (page <= 1) return
    if (abortRef.current) abortRef.current.abort()
    const newPage = page - 1
    setPage(newPage)
    const controller = new AbortController()
    abortRef.current = controller
    void doFetch(activeQueryRef.current, newPage, controller.signal)
  }, [page, doFetch])

  return { songs, isLoading, error, page, hasMore, search, nextPage, prevPage }
}
