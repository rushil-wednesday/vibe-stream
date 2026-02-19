import type { Session, User } from "@supabase/supabase-js"

/** Auth state tracked by the useAuthStore */
export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  hasPassword: boolean
}

/** Form field errors returned from auth actions */
export interface AuthFormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

/** Result of an auth action (login, signup, etc.) */
export interface AuthActionResult {
  success: boolean
  error?: string
  redirectTo?: string
}

/** Provider types supported by the app */
export type OAuthProvider = "google"
