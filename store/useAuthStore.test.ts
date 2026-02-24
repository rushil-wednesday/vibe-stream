import type { Session, User } from "@supabase/supabase-js"
import { beforeEach, describe, expect, it } from "vitest"

import { useAuthStore } from "./useAuthStore"

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().reset()
  })

  it("initialises with null user and loading=true", () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.isLoading).toBe(true)
    expect(state.hasPassword).toBe(false)
  })

  it("setUser() updates user", () => {
    const mockUser = { id: "123", email: "test@test.com" } as User
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().user?.id).toBe("123")
  })

  it("setSession() updates session", () => {
    useAuthStore.getState().setSession({ access_token: "tok" } as unknown as Session)
    expect(useAuthStore.getState().session).not.toBeNull()
  })

  it("setHasPassword() updates hasPassword", () => {
    useAuthStore.getState().setHasPassword(true)
    expect(useAuthStore.getState().hasPassword).toBe(true)
  })

  it("setLoading() updates isLoading", () => {
    useAuthStore.getState().setLoading(false)
    expect(useAuthStore.getState().isLoading).toBe(false)
  })

  it("reset() clears all state back to initial", () => {
    useAuthStore.getState().setUser({ id: "123" } as User)
    useAuthStore.getState().setSession({ access_token: "tok" } as unknown as Session)
    useAuthStore.getState().setLoading(false)
    useAuthStore.getState().setHasPassword(true)
    useAuthStore.getState().reset()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().session).toBeNull()
    expect(useAuthStore.getState().isLoading).toBe(true)
    expect(useAuthStore.getState().hasPassword).toBe(false)
  })
})
