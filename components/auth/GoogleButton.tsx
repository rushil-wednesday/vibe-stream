"use client"

import React, { useState } from "react"

import { GoogleIcon } from "assets/icons"
import { Button } from "components/ui/Button"
import { AUTH_ROUTES } from "constants/auth"
import { createClient } from "lib/supabase/client"

interface GoogleButtonProps {
  label?: string
}

/**
 * Google OAuth sign-in button.
 * Redirects to Google's OAuth consent screen via Supabase.
 */
export function GoogleButton({ label = "Continue with Google" }: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleClick(): Promise<void> {
    setIsLoading(true)
    setError("")
    try {
      const supabase = createClient()
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${AUTH_ROUTES.AUTH_CALLBACK}`,
        },
      })
      if (oauthError) {
        setError(oauthError.message)
      }
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={handleClick}
        disabled={isLoading}
        aria-label={label}
      >
        <GoogleIcon className="h-5 w-5" />
        {label}
      </Button>
      {error && (
        <p
          className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </>
  )
}
