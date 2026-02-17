"use client"

import Image from "next/image"
import React, { useState } from "react"

import { Slider } from "components/ui/Slider"
import { useAudio } from "hooks/useAudio"
import { usePlayerStore } from "store/usePlayerStore"
import { getArtworkUrl } from "types/itunes"

function PlayIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  )
}

function PauseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function VolumeIcon({ muted }: { muted: boolean }) {
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


function SkipButton({
  direction,
  onClick,
  className = "",
  iconClassName = "h-6 w-6",
  ariaLabel,
}: {
  direction: "back" | "forward"
  onClick: () => void
  className?: string
  iconClassName?: string
  ariaLabel: string
}) {
  const [animKey, setAnimKey] = useState(0)
  const isBack = direction === "back"

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    onClick()
    setAnimKey((k) => k + 1)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={[
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "text-gray-600 dark:text-gray-400",
        "ring-1 ring-gray-300 hover:bg-gray-100 dark:ring-gray-700 dark:hover:bg-gray-800",
        "transition-colors",
        className,
      ].join(" ")}
    >
      {/* Ripple — mounted fresh each click so the animation restarts */}
      {animKey > 0 && (
        <span
          key={`ripple-${animKey}`}
          className="pointer-events-none absolute inset-0 rounded-full bg-violet-400/25"
          style={{ animation: "skipRipple 0.4s ease-out forwards" }}
        />
      )}

      {/* Arc-arrow SVG — re-keyed each click to restart the nudge animation */}
      <svg
        key={`icon-${animKey}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassName}
        style={animKey > 0 ? { animation: `${isBack ? "skipNudgeLeft" : "skipNudgeRight"} 0.35s ease-out` } : undefined}
        aria-hidden="true"
      >
        {isBack ? (
          <>
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </>
        ) : (
          <>
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
          </>
        )}
      </svg>

      {/* "10" label — separate HTML element for better font rendering */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="text-[8px] leading-none font-bold">10</span>
      </span>
    </button>
  )
}

/**
 * Shared playback controls — skip back, play/pause, skip forward.
 * Accepts a `variant` to render compact (minimised bar) or full (expanded panel) sizing.
 */
function PlaybackControls({
  variant,
  isPlaying,
  onPlayPause,
  onSkipBack,
  onSkipForward,
}: {
  variant: "compact" | "full"
  isPlaying: boolean
  onPlayPause: React.MouseEventHandler<HTMLButtonElement>
  onSkipBack: () => void
  onSkipForward: () => void
}) {
  const isCompact = variant === "compact"

  return (
    <div className={isCompact ? "flex items-center gap-1" : "flex items-center justify-center gap-6 md:gap-4"}>
      <SkipButton
        direction="back"
        onClick={onSkipBack}
        ariaLabel="Skip back 10 seconds"
        className={isCompact ? "h-9 w-9" : "h-[54px] w-[54px] md:h-12 md:w-12"}
        iconClassName={isCompact ? "h-5 w-5" : "h-7 w-7 md:h-6 md:w-6"}
      />

      <button
        type="button"
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
        className={[
          "flex shrink-0 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none dark:bg-violet-500 dark:hover:bg-violet-400",
          isCompact ? "h-10 w-10" : "h-[72px] w-[72px] shadow-md md:h-12 md:w-12",
        ].join(" ")}
      >
        {isPlaying ? (
          <PauseIcon className={isCompact ? "h-5 w-5" : "h-8 w-8 md:h-5 md:w-5"} />
        ) : (
          <PlayIcon className={isCompact ? "h-5 w-5" : "h-8 w-8 md:h-5 md:w-5"} />
        )}
      </button>

      <SkipButton
        direction="forward"
        onClick={onSkipForward}
        ariaLabel="Skip forward 10 seconds"
        className={isCompact ? "h-9 w-9" : "h-[54px] w-[54px] md:h-12 md:w-12"}
        iconClassName={isCompact ? "h-5 w-5" : "h-7 w-7 md:h-6 md:w-6"}
      />
    </div>
  )
}

const ARTWORK_SIZE_SMALL = 80
const ARTWORK_SIZE_LARGE = 500
const SKIP_SECONDS = 10

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

/**
 * MiniPlayer — fixed bottom bar that expands to a full player panel.
 *
 * Minimised state: artwork + track info + controls, all centred within max-w-2xl.
 * Expanded state: single centred column for both mobile and desktop (max-w-2xl).
 *   Mobile  — artwork 58 vw / 240 px max, buttons 50% larger than desktop.
 *   Desktop — artwork 160 px, standard button sizes.
 * Renders null when no song has been loaded.
 */
export function MiniPlayer() {
  useAudio()

  const { currentSong, isPlaying, progress, duration, volume, pause, resume, seek, setVolume } = usePlayerStore()
  const [expanded, setExpanded] = useState(false)

  if (!currentSong) return null

  const currentSeconds = progress * duration
  const artworkSmall = getArtworkUrl(currentSong.artworkUrl100, ARTWORK_SIZE_SMALL)
  const artworkLarge = getArtworkUrl(currentSong.artworkUrl100, ARTWORK_SIZE_LARGE)

  function handlePlayPause() {
    if (isPlaying) pause()
    else resume()
  }

  function handleSkip(seconds: number) {
    if (duration > 0) {
      const newFraction = Math.max(0, Math.min(1, (currentSeconds + seconds) / duration))
      seek(newFraction)
    }
  }

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setExpanded(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={[
          "fixed right-0 bottom-0 left-0 z-50",
          "border-t border-gray-200 dark:border-gray-800",
          "bg-white/95 dark:bg-gray-950/95",
          "overflow-hidden backdrop-blur-md",
          "transition-[max-height] duration-300 ease-in-out",
          expanded ? "max-h-[92dvh] md:max-h-[560px]" : "max-h-[68px]",
        ].join(" ")}
      >
        {/* Thin progress stripe along top edge (minimised only) */}
        {!expanded && (
          <div className="absolute top-0 right-0 left-0 h-0.5 overflow-hidden bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full origin-left bg-violet-500 transition-transform duration-300 dark:bg-violet-400"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        )}

        {/* ── MINIMISED BAR ── */}
        <div
          className={["h-[68px] cursor-pointer", expanded ? "hidden" : "block"].join(" ")}
          onClick={() => setExpanded(true)}
          role="button"
          tabIndex={0}
          aria-label="Expand player"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded(true)}
        >
          {/* Content centred within max-w-2xl */}
          <div className="mx-auto flex h-full max-w-2xl items-center gap-3 px-4">
            {/* Artwork */}
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <Image src={artworkSmall} alt="" fill sizes="40px" className="object-cover" unoptimized />
            </div>

            {/* Track info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{currentSong.trackName}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{currentSong.artistName}</p>
            </div>

            {/* Controls — skip back, play/pause, skip forward */}
            <PlaybackControls
              variant="compact"
              isPlaying={isPlaying}
              onPlayPause={(e) => {
                e.stopPropagation()
                handlePlayPause()
              }}
              onSkipBack={() => handleSkip(-SKIP_SECONDS)}
              onSkipForward={() => handleSkip(SKIP_SECONDS)}
            />
          </div>
        </div>

        {/* ── EXPANDED PANEL ── */}
        {expanded && (
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-6 pt-3 pb-6">
            {/* Collapse handle */}
            <div className="flex w-full justify-center">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Minimise player"
                className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <ChevronDownIcon /> Now Playing
              </button>
            </div>

            {/* Artwork — responsive: mobile 58 vw / 240 px, desktop 160 px */}
            <div className="relative aspect-square w-[58vw] max-w-[240px] overflow-hidden rounded-2xl shadow-xl md:w-40">
              <Image
                src={artworkLarge}
                alt={currentSong.collectionName}
                fill
                sizes="(max-width: 768px) 58vw, 160px"
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Track info — centred */}
            <div className="w-full text-center">
              <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{currentSong.trackName}</p>
              <p className="truncate text-sm text-gray-500 dark:text-gray-400">{currentSong.artistName}</p>
              <p className="truncate text-xs text-gray-400 dark:text-gray-500">{currentSong.collectionName}</p>
            </div>

            {/* Seek bar + timestamps */}
            <div className="flex w-full flex-col gap-1">
              <Slider
                variant="progress"
                min={0}
                max={100}
                step={0.1}
                value={[progress * 100]}
                onValueChange={([val]) => seek((val ?? 0) / 100)}
                aria-label="Playback position"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>{formatTime(currentSeconds)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback controls — centred, 50% larger on mobile */}
            <PlaybackControls
              variant="full"
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onSkipBack={() => handleSkip(-SKIP_SECONDS)}
              onSkipForward={() => handleSkip(SKIP_SECONDS)}
            />

            {/* Volume */}
            <div className="flex w-full items-center gap-2">
              <VolumeIcon muted={volume === 0} />
              <Slider
                variant="volume"
                min={0}
                max={100}
                step={1}
                value={[volume * 100]}
                onValueChange={([val]) => setVolume((val ?? 0) / 100)}
                aria-label="Volume"
                className="max-w-full"
              />
              <span className="w-7 shrink-0 text-right text-xs text-gray-400 tabular-nums dark:text-gray-500">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
