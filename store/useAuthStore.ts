/**
 * Stub: Auth Zustand store.
 *
 * The real implementation is provided by the auth stack (PR #42).
 * This stub allows playlist code to compile before auth merges.
 * It will be replaced when the auth PRs land.
 */
import { create } from "zustand"

interface AuthUser {
  id: string
  email?: string
}

interface AuthStoreState {
  user: AuthUser | null
}

export const useAuthStore = create<AuthStoreState>()(() => ({
  user: null,
}))
