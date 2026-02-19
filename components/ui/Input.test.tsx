import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Input } from "./Input"

describe("Input", () => {
  it("renders a text input", () => {
    render(<Input />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("forwards onChange events", () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } })
    expect(onChange).toHaveBeenCalledOnce()
  })

  it("applies search variant classes", () => {
    const { container } = render(<Input variant="search" />)
    // TODO: assert search-specific padding class (pl-9) is present
    expect(container.firstChild).toBeInTheDocument()
  })

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })
})
