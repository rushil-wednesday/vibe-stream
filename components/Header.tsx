"use client"

import React from "react"

import { ThemeToggle } from "components/ThemeToggle"

/**
 * Top navigation bar with the VibeStream wordmark and the theme toggle.
 * Kept purposefully minimal for MVP — no nav links or user menu.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo / wordmark */}
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="8" fill="#6C5CE7" />
            <path
              d="M8 20 L12 10 L16 18 L20 8 L24 20"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Vibe<span className="text-violet-600 dark:text-violet-400">Stream</span>
          </span>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}
