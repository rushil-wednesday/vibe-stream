import { render, screen } from "@testing-library/react"
import { beforeAll, describe, expect, it, vi } from "vitest"

import { Slider } from "./Slider"

// Radix UI uses ResizeObserver internally; polyfill for jsdom
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})

describe("Slider", () => {
  it("renders a slider role element", () => {
    render(<Slider aria-label="Volume" value={[50]} min={0} max={100} onValueChange={vi.fn()} />)
    // Radix puts role=slider on the Thumb, which has its own aria-label="Adjust value"
    expect(screen.getByRole("slider")).toBeInTheDocument()
  })

  it("renders progress variant without errors", () => {
    render(<Slider variant="progress" aria-label="Seek" value={[0]} min={0} max={100} onValueChange={vi.fn()} />)
    expect(screen.getByRole("slider")).toBeInTheDocument()
  })

  it("hides thumb when showThumb=false", () => {
    render(<Slider showThumb={false} aria-label="Progress" value={[0]} min={0} max={100} onValueChange={vi.fn()} />)
    // No thumb rendered → no slider role
    expect(screen.queryByRole("slider")).not.toBeInTheDocument()
  })

  it("renders with correct value attribute", () => {
    render(<Slider aria-label="Volume" value={[75]} min={0} max={100} onValueChange={vi.fn()} />)
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "75")
  })
})
