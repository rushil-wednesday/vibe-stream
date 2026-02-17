import { NextRequest, NextResponse } from "next/server"

const ITUNES_API = "https://itunes.apple.com/search"
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
const MAX_TERM_LENGTH = 100
const MAX_RESULT_LIMIT = 50
const NEXT_REVALIDATE_SECONDS = 300

interface CacheEntry {
  data: unknown
  expiresAt: number
}

// In-memory cache shared across requests within a single server instance
const cache = new Map<string, CacheEntry>()

function getCached(key: string): unknown | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

/**
 * GET /api/itunes?term=<query>&limit=<n>
 *
 * Server-side proxy for the iTunes Search API.
 * - Avoids CORS (iTunes does not send CORS headers)
 * - Adds 5-minute in-memory cache to stay within rate limits (~20 req/min)
 * - Validates and sanitises the `term` query parameter
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl

  const term = searchParams.get("term")?.trim()
  if (!term) {
    return NextResponse.json({ error: "Missing required query parameter: term" }, { status: 400 })
  }

  // Sanitise: max 100 chars, strip control characters
  const sanitisedTerm = term.slice(0, MAX_TERM_LENGTH).replace(/[\x00-\x1F\x7F]/g, "")
  const limit = Math.min(Number(searchParams.get("limit") ?? "25"), MAX_RESULT_LIMIT)
  const offset = Math.max(0, Number(searchParams.get("offset") ?? "0"))

  const cacheKey = `${sanitisedTerm}:${limit}:${offset}`
  const cached = getCached(cacheKey)
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "X-Cache": "HIT" },
    })
  }

  const upstream = new URL(ITUNES_API)
  upstream.searchParams.set("term", sanitisedTerm)
  upstream.searchParams.set("media", "music")
  upstream.searchParams.set("entity", "song")
  upstream.searchParams.set("limit", String(limit))
  upstream.searchParams.set("offset", String(offset))

  const response = await fetch(upstream.toString(), {
    next: { revalidate: NEXT_REVALIDATE_SECONDS }, // also hint Next.js data cache
  })

  if (!response.ok) {
    return NextResponse.json({ error: `Upstream iTunes API returned ${response.status}` }, { status: 502 })
  }

  const data: unknown = await response.json()
  setCache(cacheKey, data)

  return NextResponse.json(data, {
    headers: { "X-Cache": "MISS" },
  })
}
