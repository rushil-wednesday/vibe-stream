import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { AUTH_ROUTES, POST_LOGIN_REDIRECT } from "constants/auth"
import { createServerSupabaseClient } from "lib/supabase/server"

/**
 * GET /auth/callback
 *
 * Handles the OAuth/email-verification redirect from Supabase.
 * Exchanges the `code` for a session, then redirects:
 * - To /set-password if the user signed up via Google and has no password
 * - To / (home) otherwise
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? POST_LOGIN_REDIRECT

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Redirect new Google OAuth users to set a password (one-time only)
      const isOAuthUser = data.user.app_metadata?.provider === "google"
      const hasPassword = data.user.user_metadata?.has_password === true

      if (isOAuthUser && !hasPassword) {
        return NextResponse.redirect(new URL(AUTH_ROUTES.SET_PASSWORD, origin))
      }

      return NextResponse.redirect(new URL(next, origin))
    }
  }

  // If code exchange failed, redirect to login with error
  return NextResponse.redirect(new URL(`${AUTH_ROUTES.LOGIN}?error=auth_callback_error`, origin))
}
