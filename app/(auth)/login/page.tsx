"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useState } from "react"

import { AuthDivider } from "components/auth/AuthDivider"
import { GoogleButton } from "components/auth/GoogleButton"
import { PasswordInput } from "components/auth/PasswordInput"
import { Button } from "components/ui/Button"
import { Input } from "components/ui/Input"
import { AUTH_ERRORS, AUTH_ROUTES, POST_LOGIN_REDIRECT } from "constants/auth"
import { createClient } from "lib/supabase/client"
import { loginFormSchema } from "lib/validation/auth"

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? POST_LOGIN_REDIRECT
  const callbackError = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(callbackError ? AUTH_ERRORS.GENERIC_ERROR : "")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setError("")

    const result = loginFormSchema.safeParse({ email, password })
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? AUTH_ERRORS.GENERIC_ERROR)
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setIsLoading(false)
      if (authError.message.includes("Invalid login credentials")) {
        setError(AUTH_ERRORS.INVALID_CREDENTIALS)
      } else if (authError.message.includes("Email not confirmed")) {
        setError(AUTH_ERRORS.EMAIL_NOT_CONFIRMED)
      } else {
        setError(AUTH_ERRORS.GENERIC_ERROR)
      }
      return
    }

    router.push(next)
  }

  return (
    <>
      <h1 className="mb-6 text-center text-xl font-bold text-[--text-primary]">Sign in to VibeStream</h1>

      <GoogleButton />

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
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[--text-primary]">
              Password
            </label>
            <Link
              href={AUTH_ROUTES.RESET_PASSWORD}
              className="text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[--text-secondary]">
        Don&apos;t have an account?{" "}
        <Link
          href={AUTH_ROUTES.SIGNUP}
          className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
        >
          Sign up
        </Link>
      </p>
    </>
  )
}
