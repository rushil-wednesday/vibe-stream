import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VibeStream - Sign In",
}

export default function AuthLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[--bg-primary] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="8" fill="var(--accent)" />
            <path
              d="M8 20 L12 10 L16 18 L20 8 L24 20"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="text-xl font-bold tracking-tight text-[--text-primary]">
            Vibe<span className="text-violet-600 dark:text-violet-400">Stream</span>
          </span>
        </div>

        {/* Auth card */}
        <div className="rounded-xl border border-[--border] bg-[--bg-elevated] p-6 shadow-sm">{children}</div>
      </div>
    </div>
  )
}
