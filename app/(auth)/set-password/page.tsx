"use client"

import type { Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

import { PasswordInput } from "components/auth/PasswordInput"
import { Button } from "components/ui/Button"
import { AUTH_ERRORS, AUTH_ROUTES, POST_LOGIN_REDIRECT } from "constants/auth"
import { createClient } from "lib/supabase/client"
import { setPasswordFormSchema } from "lib/validation/auth"

export default function SetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Listen for auth state changes — PASSWORD_RECOVERY fires when the
    // user arrives via a reset-password link and the code is exchanged.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (session) {
        setHasSession(true)
      }
    })

    // Also check for an existing session (e.g. Google OAuth set-password flow)
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session) {
        setHasSession(true)
      } else if (!window.location.hash.includes("access_token")) {
        // Only redirect if not in a password-reset flow (token exchange pending)
        router.replace(AUTH_ROUTES.LOGIN)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setError("")

    const result = setPasswordFormSchema.safeParse({ password, confirmPassword })
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? AUTH_ERRORS.GENERIC_ERROR)
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.updateUser({
      password,
      data: { has_password: true },
    })

    setIsLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    router.push(POST_LOGIN_REDIRECT)
  }

  if (!hasSession) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-2 text-center text-xl font-bold text-[--text-primary]">Set your password</h1>
      <p className="mb-6 text-center text-sm text-[--text-secondary]">Create a password to secure your account.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[--text-primary]">
            Password
          </label>
          <PasswordInput
            id="password"
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-[--text-primary]">
            Confirm password
          </label>
          <PasswordInput
            id="confirm-password"
            label="Confirm password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {error && (
          <p
            className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "Setting password..." : "Set password"}
        </Button>
      </form>
    </>
  )
}
