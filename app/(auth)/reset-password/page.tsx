"use client"

import Link from "next/link"
import React, { useState } from "react"

import { Button } from "components/ui/Button"
import { Input } from "components/ui/Input"
import { AUTH_ERRORS, AUTH_ROUTES } from "constants/auth"
import { createClient } from "lib/supabase/client"
import { resetPasswordFormSchema } from "lib/validation/auth"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setError("")

    const result = resetPasswordFormSchema.safeParse({ email })
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? AUTH_ERRORS.GENERIC_ERROR)
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${AUTH_ROUTES.AUTH_CALLBACK}?next=${AUTH_ROUTES.SET_PASSWORD}`,
    })

    setIsLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setEmailSent(true)
  }

  if (emailSent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6 text-green-600 dark:text-green-400"
            aria-hidden="true"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-[--text-primary]">Check your email</h2>
        <p className="text-sm text-[--text-secondary]">
          We sent a password reset link to <strong className="text-[--text-primary]">{email}</strong>.
        </p>
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="mt-2 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-2 text-center text-xl font-bold text-[--text-primary]">Reset your password</h1>
      <p className="mb-6 text-center text-sm text-[--text-secondary]">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[--text-primary]">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[--text-secondary]">
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
        >
          Back to sign in
        </Link>
      </p>
    </>
  )
}
