"use client"

import React, { useRef } from "react"

import { Input } from "components/ui/Input"

interface SearchBarProps {
  /** Called whenever the user's input changes (debounced inside useItunesSearch) */
  onSearch: (query: string) => void
  isLoading?: boolean
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-gray-400"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

/**
 * Controlled search input with a search icon and an X clear button.
 * Delegates debouncing and API calls to the parent via onSearch.
 */
export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [value, setValue] = React.useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    onSearch(e.target.value)
  }

  function handleClear() {
    setValue("")
    onSearch("")
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full max-w-xl">
      {/* Search icon */}
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
        {isLoading ? <Spinner /> : <SearchIcon />}
      </span>

      <Input
        ref={inputRef}
        variant="search"
        size="lg"
        type="search"
        placeholder="Search songs, artists, or albums…"
        value={value}
        onChange={handleChange}
        aria-label="Search music"
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80"
      />

      {/* Clear button — only shown when input has text */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-violet-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
