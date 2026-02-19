import { type NextRequest, NextResponse } from "next/server"

import { PUBLIC_ROUTES, UNAUTHENTICATED_REDIRECT } from "constants/auth"
import { createMiddlewareClient } from "lib/supabase/middleware"

/**
 * Next.js middleware that:
 * 1. Refreshes the Supabase auth token on every request (keeps session alive)
 * 2. Redirects unauthenticated users away from protected routes
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { supabase, response } = createMiddlewareClient(request)

  // Refresh session — MUST happen before any auth checks
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Skip protection for public routes, API routes, and static assets
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith("/api")
  const isStaticAsset = pathname.startsWith("/_next") || pathname.includes(".")

  if (!user && !isPublicRoute && !isApiRoute && !isStaticAsset) {
    const loginUrl = new URL(UNAUTHENTICATED_REDIRECT, request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
