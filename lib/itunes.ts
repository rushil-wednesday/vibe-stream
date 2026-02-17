import type { ITunesApiResult, ITunesSearchResponse, ITunesSong } from "types/itunes"

const BASE_URL = "/api/itunes"

/** Curated queries used on the homepage when no search term is active */
const DEFAULT_QUERIES = ["top hits", "pop", "hip hop", "indie", "electronic"]

function pickDefaultQuery(): string {
  return DEFAULT_QUERIES[Math.floor(Math.random() * DEFAULT_QUERIES.length)] ?? "top hits"
}

function isValidSong(result: ITunesApiResult): result is ITunesApiResult & ITunesSong {
  return (
    result.wrapperType === "track" &&
    result.kind === "song" &&
    typeof result.previewUrl === "string" &&
    result.previewUrl.length > 0 &&
    typeof result.trackId === "number"
  )
}

/**
 * Fetch songs matching `query` via the server-side iTunes proxy.
 * @param query Search term (title / artist / album)
 * @param limit Max results (default 25)
 * @param offset Pagination offset in the iTunes result set (default 0)
 * @param signal Optional AbortController signal for cancellation
 */
export async function fetchSongs(query: string, limit = 25, offset = 0, signal?: AbortSignal): Promise<ITunesSong[]> {
  const params = new URLSearchParams({ term: query, limit: String(limit), offset: String(offset) })
  const res = await fetch(`${BASE_URL}?${params}`, { signal })

  if (!res.ok) throw new Error(`iTunes API error: ${res.status}`)

  const data = (await res.json()) as ITunesSearchResponse
  return data.results.filter(isValidSong) as ITunesSong[]
}

/**
 * Fetch a curated set of popular songs for the homepage default view.
 * Uses a random query from the DEFAULT_QUERIES list to keep results fresh.
 */
export async function fetchDefaultSongs(signal?: AbortSignal): Promise<ITunesSong[]> {
  return fetchSongs(pickDefaultQuery(), 25, 0, signal)
}
