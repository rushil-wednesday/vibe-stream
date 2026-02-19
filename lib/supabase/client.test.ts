import { describe, expect, it, vi } from "vitest"

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn().mockReturnValue({ auth: {} }),
}))

vi.mock("env.mjs", () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
  },
}))

const { createClient } = await import("./client")

describe("createClient", () => {
  it("returns a supabase client with auth property", () => {
    const client = createClient()
    expect(client).toHaveProperty("auth")
  })

  it("calls createBrowserClient with correct env vars", async () => {
    const { createBrowserClient } = await import("@supabase/ssr")
    createClient()
    expect(createBrowserClient).toHaveBeenCalledWith("https://test.supabase.co", "test-anon-key")
  })
})
