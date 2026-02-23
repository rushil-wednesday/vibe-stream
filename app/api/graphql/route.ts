import { NextRequest, NextResponse } from "next/server"

import { createServerSupabaseClient } from "lib/supabase/server"

const GRAPHQL_API_URL = process.env.GRAPHQL_API_URL || "http://localhost:9000/graphql"
const GRAPHQL_INTERNAL_SECRET = process.env.GRAPHQL_INTERNAL_SECRET

/**
 * POST /api/graphql
 *
 * Trusted proxy: extracts Supabase user from cookies, forwards GraphQL
 * requests to the backend with x-user-id and x-internal-secret headers.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!GRAPHQL_INTERNAL_SECRET) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body: unknown = await request.json()

  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": user.id,
      "x-internal-secret": GRAPHQL_INTERNAL_SECRET,
    },
    body: JSON.stringify(body),
  })

  const data: unknown = await response.json()
  return NextResponse.json(data, { status: response.status })
}
