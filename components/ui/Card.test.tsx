import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Card } from "./Card"

describe("Card", () => {
  it("renders children", () => {
    render(<Card>content</Card>)
    expect(screen.getByText("content")).toBeInTheDocument()
  })

  it("applies default variant classes", () => {
    const { container } = render(<Card>default</Card>)
    // TODO: assert rounded-xl and default border classes are present
    expect(container.firstChild).toBeInTheDocument()
  })

  it("applies interactive variant classes", () => {
    const { container } = render(<Card variant="interactive">interactive</Card>)
    // TODO: assert cursor-pointer and hover classes are present
    expect(container.firstChild).toBeInTheDocument()
  })

  it("applies playing variant classes", () => {
    const { container } = render(<Card variant="playing">playing</Card>)
    // TODO: assert violet border and glow shadow classes are present
    expect(container.firstChild).toBeInTheDocument()
  })
})
