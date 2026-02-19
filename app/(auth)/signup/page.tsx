"use client"

import Link from "next/link"
import React, { useState } from "react"

import { AuthDivider } from "components/auth/AuthDivider"
import { GoogleButton } from "components/auth/GoogleButton"
import { PasswordInput } from "components/auth/PasswordInput"
import { Button } from "components/ui/Button"
import { Input } from "components/ui/Input"
import { AUTH_ERRORS, AUTH_ROUTES } from "constants/auth"
import { createClient } from "lib/supabase/client"
import { signupFormSchema } from "lib/validation/auth"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setError("")

    const result = signupFormSchema.safeParse({ email, password, confirmPassword })
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? AUTH_ERRORS.GENERIC_ERROR)
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${AUTH_ROUTES.AUTH_CALLBACK}`,
      },
    })

    setIsLoading(false)

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError(AUTH_ERRORS.EMAIL_TAKEN)
      } else {
        setError(AUTH_ERRORS.GENERIC_ERROR)
      }
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
            <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-[--text-primary]">Check your email</h2>
        <p className="text-sm text-[--text-secondary]">
          We sent a verification link to <strong className="text-[--text-primary]">{email}</strong>. Click the link to
          verify your account.
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
      <h1 className="mb-6 text-center text-xl font-bold text-[--text-primary]">Create your account</h1>

      <GoogleButton label="Sign up with Google" />

      <AuthDivider />

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
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[--text-secondary]">
        Already have an account?{" "}
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
        >
          Sign in
        </Link>
      </p>
    </>
  )
}
