/** Route paths for auth-related pages */
export const AUTH_ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  RESET_PASSWORD: "/reset-password",
  SET_PASSWORD: "/set-password",
  AUTH_CALLBACK: "/auth/callback",
} as const

/** Routes that do not require authentication */
export const PUBLIC_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.SIGNUP,
  AUTH_ROUTES.RESET_PASSWORD,
  AUTH_ROUTES.SET_PASSWORD,
  AUTH_ROUTES.AUTH_CALLBACK,
] as const

/** Route to redirect to after successful login */
export const POST_LOGIN_REDIRECT = "/"

/** Route to redirect to when unauthenticated */
export const UNAUTHENTICATED_REDIRECT = AUTH_ROUTES.LOGIN

/** Minimum password length */
export const PASSWORD_MIN_LENGTH = 8

/** Maximum password length */
export const PASSWORD_MAX_LENGTH = 72

/** Error messages for auth forms */
export const AUTH_ERRORS = {
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_TOO_LONG: `Password must be at most ${PASSWORD_MAX_LENGTH} characters`,
  PASSWORDS_MISMATCH: "Passwords do not match",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_TAKEN: "An account with this email already exists",
  EMAIL_NOT_CONFIRMED: "Please verify your email before signing in",
  RATE_LIMITED: "Too many attempts. Please try again later.",
} as const
