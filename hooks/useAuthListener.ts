"use client"

import { useEffect } from "react"

import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

import { createClient } from "lib/supabase/client"
import { useAuthStore } from "store/useAuthStore"

/**
 * Subscribes to Supabase auth state changes and syncs to the Zustand store.
 * Must be mounted once at the root level (e.g., in AuthProvider).
 */
export function useAuthListener(): void {
  const setUser = useAuthStore((s) => s.setUser)
  const setSession = useAuthStore((s) => s.setSession)
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    const supabase = createClient()

    const handleSession = (session: Session | null) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: Session | null } }) => {
        handleSession(session)
      })
      .catch(() => {
        handleSession(null)
      })

    // Subscribe to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      handleSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setSession, setLoading])
}
