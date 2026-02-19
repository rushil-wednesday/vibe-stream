"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"

import { AUTH_ROUTES } from "constants/auth"
import { createClient } from "lib/supabase/client"
import { useAuthStore } from "store/useAuthStore"
import { usePlayerStore } from "store/usePlayerStore"

/**
 * User avatar + dropdown menu with reset-password and sign-out actions.
 * Shows a sign-in link when unauthenticated.
 */
export function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const router = useRouter()

  if (isLoading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
  }

  if (!user) {
    return (
      <a
        href={AUTH_ROUTES.LOGIN}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
      >
        Sign in
      </a>
    )
  }

  const initial = (user.email?.[0] ?? "U").toUpperCase()
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined

  async function handleSignOut(): Promise<void> {
    usePlayerStore.getState().reset()
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(AUTH_ROUTES.LOGIN)
  }

  const menuItemClass =
    "cursor-pointer rounded-md px-3 py-2 text-sm text-[--text-primary] outline-none hover:bg-gray-100 dark:hover:bg-gray-800"

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none dark:bg-violet-500"
          aria-label="User menu"
        >
          {avatarUrl ? (
            <Image src={avatarUrl} alt="" width={32} height={32} className="h-8 w-8 rounded-full" unoptimized />
          ) : (
            initial
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[160px] rounded-lg border border-[--border] bg-[--bg-elevated] p-1 shadow-lg"
          sideOffset={8}
          align="end"
        >
          <DropdownMenu.Item className={menuItemClass} onSelect={() => router.push(AUTH_ROUTES.RESET_PASSWORD)}>
            Reset password
          </DropdownMenu.Item>

          <DropdownMenu.Item className={menuItemClass} onSelect={handleSignOut}>
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
