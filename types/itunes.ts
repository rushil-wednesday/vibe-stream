/**
 * A single song result from the iTunes Search API.
 * Only the fields VibeStream actually uses are typed here.
 */
export interface ITunesSong {
  trackId: number
  trackName: string
  artistName: string
  /** Album / collection name */
  collectionName: string
  /** 100×100 album artwork URL — replace dimensions for higher res */
  artworkUrl100: string
  /** 30-second audio preview URL (.m4a) */
  previewUrl: string
  trackTimeMillis: number
  primaryGenreName: string
  releaseDate: string
}

/** Top-level shape returned by the iTunes Search API */
export interface ITunesSearchResponse {
  resultCount: number
  results: ITunesApiResult[]
}

/**
 * Raw API result — wrapperType/kind guard the union.
 * We only consume wrapperType === "track" && kind === "song".
 */
export interface ITunesApiResult extends Partial<ITunesSong> {
  wrapperType: string
  kind?: string
}

/** Returns the artwork URL at a given pixel size (default 500) */
export function getArtworkUrl(url: string, size = 500): string {
  return url.replace("100x100bb", `${size}x${size}bb`)
}
