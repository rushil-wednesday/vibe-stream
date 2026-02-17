import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Skeleton } from "./Skeleton"

describe("Skeleton", () => {
  it("renders as aria-hidden", () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true")
  })

  it("applies card variant classes", () => {
    const { container } = render(<Skeleton variant="card" />)
    // TODO: assert rounded-xl and w-full classes
    expect(container.firstChild).toBeInTheDocument()
  })

  it("applies circle variant classes", () => {
    const { container } = render(<Skeleton variant="circle" />)
    // TODO: assert rounded-full class
    expect(container.firstChild).toBeInTheDocument()
  })

  it("merges custom className", () => {
    const { container } = render(<Skeleton className="h-4 w-24" />)
    expect(container.firstChild).toHaveClass("h-4", "w-24")
  })
})
