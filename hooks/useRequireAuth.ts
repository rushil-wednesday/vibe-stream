"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import { UNAUTHENTICATED_REDIRECT } from "constants/auth"
import { useAuthStore } from "store/useAuthStore"

/**
 * Redirects to the login page if the user is not authenticated.
 * Returns { user, isLoading } so the component can render a loading state.
 */
export function useRequireAuth(): {
  user: ReturnType<typeof useAuthStore.getState>["user"]
  isLoading: boolean
} {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(UNAUTHENTICATED_REDIRECT)
    }
  }, [user, isLoading, router])

  return { user, isLoading }
}
