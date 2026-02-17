"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { fetchDefaultSongs, fetchSongs } from "lib/itunes"
import type { ITunesSong } from "types/itunes"

const DEBOUNCE_MS = 500
const PAGE_SIZE = 25

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
 * - Exposes nextPage / prevPage for paginating through search results
 */
export function useItunesSearch(): UseItunesSearchResult {
  const [songs, setSongs] = useState<ITunesSong[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("")

  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doFetch = useCallback(async (query: string, pageNum: number, signal: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      const offset = (pageNum - 1) * PAGE_SIZE
      const results = query.trim()
        ? await fetchSongs(query, PAGE_SIZE, offset, signal)
        : await fetchDefaultSongs(signal)
      if (!signal.aborted) {
        setSongs(results)
        // Only show pagination for explicit searches (not default homepage view)
        setHasMore(query.trim() ? results.length === PAGE_SIZE : false)
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
    const controller = new AbortController()
    abortRef.current = controller
    void doFetch("", 1, controller.signal)
    return () => controller.abort()
  }, [doFetch])

  const search = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (abortRef.current) abortRef.current.abort()

      // Reset pagination on new query
      setPage(1)
      setCurrentQuery(query)

      debounceRef.current = setTimeout(() => {
        const controller = new AbortController()
        abortRef.current = controller
        void doFetch(query, 1, controller.signal)
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
    void doFetch(currentQuery, newPage, controller.signal)
  }, [hasMore, page, currentQuery, doFetch])

  const prevPage = useCallback(() => {
    if (page <= 1) return
    if (abortRef.current) abortRef.current.abort()
    const newPage = page - 1
    setPage(newPage)
    const controller = new AbortController()
    abortRef.current = controller
    void doFetch(currentQuery, newPage, controller.signal)
  }, [page, currentQuery, doFetch])

  return { songs, isLoading, error, page, hasMore, search, nextPage, prevPage }
}
