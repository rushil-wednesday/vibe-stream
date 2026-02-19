"use client"

import { useAuthListener } from "hooks/useAuthListener"

/**
 * Mounts the Supabase auth state listener.
 * Renders children without any wrapper DOM element.
 */
export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  useAuthListener()
  return <>{children}</>
}
