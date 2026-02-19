import { create } from "zustand"

import type { AuthState } from "types/auth"

interface AuthStoreState extends AuthState {
  setUser: (user: AuthState["user"]) => void
  setSession: (session: AuthState["session"]) => void
  setHasPassword: (hasPassword: boolean) => void
  setLoading: (isLoading: boolean) => void
  reset: () => void
}

const INITIAL_STATE: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  hasPassword: false,
}

/**
 * Zustand store for client-side auth state.
 *
 * Populated by the useAuthListener hook which subscribes to
 * Supabase's onAuthStateChange. Not persisted — Supabase cookies
 * are the single source of truth for sessions.
 */
export const useAuthStore = create<AuthStoreState>()((set) => ({
  ...INITIAL_STATE,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setHasPassword: (hasPassword) => set({ hasPassword }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set(INITIAL_STATE),
}))
