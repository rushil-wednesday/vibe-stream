import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("hooks/useAuthListener", () => ({
  useAuthListener: vi.fn(),
}))

const { AuthProvider } = await import("./AuthProvider")

describe("AuthProvider", () => {
  it("renders children", () => {
    const { getByText } = render(
      <AuthProvider>
        <p>child content</p>
      </AuthProvider>
    )
    expect(getByText("child content")).toBeInTheDocument()
  })

  it("calls useAuthListener on mount", async () => {
    const { useAuthListener } = await import("hooks/useAuthListener")
    render(
      <AuthProvider>
        <div />
      </AuthProvider>
    )
    expect(useAuthListener).toHaveBeenCalled()
  })
})
