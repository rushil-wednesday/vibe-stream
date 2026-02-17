import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { SearchBar } from "./SearchBar"

describe("SearchBar", () => {
  it("renders a search input", () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={false} />)
    expect(screen.getByRole("searchbox")).toBeInTheDocument()
  })

  it("calls onSearch with the typed value", () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} isLoading={false} />)
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Taylor Swift" } })
    // TODO: account for debounce delay before asserting onSearch call
    expect(onSearch).toHaveBeenCalledWith("Taylor Swift")
  })

  it("shows a spinner while loading", () => {
    render(<SearchBar onSearch={vi.fn()} isLoading />)
    // TODO: assert spinner element is present
  })

  it("renders a clear button when input has value", () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={false} />)
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "x" } })
    // TODO: assert clear button is present
  })
})
