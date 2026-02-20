/**
 * Stub: Supabase browser client.
 *
 * The real implementation is provided by the auth stack (PR #44).
 * This stub allows playlist service code to compile before auth merges.
 * It will be replaced when the auth PRs land.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): any {
  throw new Error("Supabase client not configured — merge auth stack first")
}
