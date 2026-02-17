"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { fetchDefaultSongs, fetchSongs } from "lib/itunes"
import type { ITunesSong } from "types/itunes"

const DEBOUNCE_MS = 500

interface UseItunesSearchResult {
  songs: ITunesSong[]
  isLoading: boolean
  error: string | null
  /** Call with an empty string to restore default homepage songs */
  search: (query: string) => void
}

/**
 * Custom hook: debounced iTunes search with loading/error states.
 *
 * - 500 ms debounce on the search call to minimise API requests
 * - Uses AbortController to cancel in-flight requests on new input
 * - Reverts to curated default songs when query is cleared
 */
export function useItunesSearch(): UseItunesSearchResult {
  const [songs, setSongs] = useState<ITunesSong[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doFetch = useCallback(async (query: string, signal: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      const results = query.trim() ? await fetchSongs(query, 25, signal) : await fetchDefaultSongs(signal)
      if (!signal.aborted) {
        setSongs(results)
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
    void doFetch("", controller.signal)
    return () => controller.abort()
  }, [doFetch])

  const search = useCallback(
    (query: string) => {
      // Cancel any pending debounce
      if (debounceRef.current) clearTimeout(debounceRef.current)
      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort()

      debounceRef.current = setTimeout(() => {
        const controller = new AbortController()
        abortRef.current = controller
        void doFetch(query, controller.signal)
      }, DEBOUNCE_MS)
    },
    [doFetch]
  )

  return { songs, isLoading, error, search }
}
