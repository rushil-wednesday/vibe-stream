import React from "react"

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  )
}

export function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

export function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function ChevronLeftIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function ChevronRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function SkipBack10Icon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
      <path d="M11.5 18a7.5 7.5 0 1 1 5.25-12.75" />
      <path d="m2 12 4-4-4-4" />
      <text x="9" y="14" fontSize="5" fill="currentColor" stroke="none" fontWeight="bold">
        10
      </text>
    </svg>
  )
}

export function SkipForward10Icon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
      <path d="M12.5 18a7.5 7.5 0 1 0-5.25-12.75" />
      <path d="m22 8-4 4 4 4" />
      <text x="9" y="14" fontSize="5" fill="currentColor" stroke="none" fontWeight="bold">
        10
      </text>
    </svg>
  )
}

export function VolumeIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M13 3a1 1 0 0 0-1.707-.707L6.586 7H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.586l4.707 4.707A1 1 0 0 0 13 21V3z" />
      <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M13 3a1 1 0 0 0-1.707-.707L6.586 7H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.586l4.707 4.707A1 1 0 0 0 13 21V3z" />
      <path d="M16.5 7.5a5 5 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19.5 4.5a9 9 0 0 1 0 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
