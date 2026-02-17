"use client"

import Image from "next/image"
import React, { useState } from "react"

import { Slider } from "components/ui/Slider"
import { useAudio } from "hooks/useAudio"
import { usePlayerStore } from "store/usePlayerStore"
import { getArtworkUrl } from "types/itunes"

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
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

function SkipBack10Icon() {
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

function SkipForward10Icon() {
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
 * Minimised state: artwork thumbnail + track info + play/pause + progress bar.
 * Expanded state:
 *   Mobile — near-fullscreen overlay with large centred artwork, track info,
 *            seek bar, centred playback controls, and volume slider.
 *   Desktop — compact bottom panel (max-w-2xl) with side-by-side artwork +
 *             controls layout; playback buttons centred.
 * Renders null when no song has been loaded (currentSong is null).
 */
export function MiniPlayer() {
  // Mount audio bridge once here — persists across all page navigations
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
      {/* Backdrop for expanded state on mobile */}
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
          "backdrop-blur-md",
          "overflow-hidden",
          "transition-[max-height] duration-300 ease-in-out",
          expanded ? "max-h-[92dvh] md:max-h-[340px]" : "max-h-[68px]",
        ].join(" ")}
      >
        {/* Thin progress bar along top edge (visible in minimised state) */}
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
          className={["flex h-[68px] cursor-pointer items-center gap-3 px-4", expanded ? "hidden" : "flex"].join(" ")}
          onClick={() => setExpanded(true)}
          role="button"
          tabIndex={0}
          aria-label="Expand player"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded(true)}
        >
          {/* Artwork */}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            <Image src={artworkSmall} alt="" fill sizes="40px" className="object-cover" unoptimized />
          </div>

          {/* Track info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{currentSong.trackName}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{currentSong.artistName}</p>
          </div>

          {/* Centred controls: skip back, play/pause, skip forward */}
          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleSkip(-SKIP_SECONDS)
              }}
              aria-label="Skip back 10 seconds"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <SkipBack10Icon />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handlePlayPause()
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleSkip(SKIP_SECONDS)
              }}
              aria-label="Skip forward 10 seconds"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <SkipForward10Icon />
            </button>
          </div>
        </div>

        {/* ── EXPANDED PANEL ── */}
        {expanded && (
          <div className="flex flex-col gap-4 px-6 pt-3 pb-6 md:mx-auto md:max-w-2xl">
            {/* Collapse handle */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Minimise player"
                className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <ChevronDownIcon /> Now Playing
              </button>
            </div>

            {/* Mobile: large centred artwork */}
            <div className="flex justify-center md:hidden">
              <div className="relative aspect-square w-[58vw] max-w-[240px] overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={artworkLarge}
                  alt={currentSong.collectionName}
                  fill
                  sizes="240px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Content row: desktop has artwork inline; mobile artwork is above */}
            <div className="flex items-center gap-6">
              {/* Desktop-only artwork */}
              <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-xl shadow-lg md:block">
                <Image
                  src={artworkLarge}
                  alt={currentSong.collectionName}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Track info + controls */}
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                {/* Track info — centred on mobile, left on desktop */}
                <div className="text-center md:text-left">
                  <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{currentSong.trackName}</p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{currentSong.artistName}</p>
                  <p className="truncate text-xs text-gray-400 dark:text-gray-500">{currentSong.collectionName}</p>
                </div>

                {/* Seek bar */}
                <div className="flex flex-col gap-1">
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

                {/* Playback controls — always centred */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleSkip(-SKIP_SECONDS)}
                    aria-label="Skip back 10 seconds"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <SkipBack10Icon />
                  </button>

                  <button
                    type="button"
                    onClick={handlePlayPause}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-md hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none dark:bg-violet-500 dark:hover:bg-violet-400"
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSkip(SKIP_SECONDS)}
                    aria-label="Skip forward 10 seconds"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <SkipForward10Icon />
                  </button>
                </div>

                {/* Volume row */}
                <div className="flex items-center gap-2">
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
            </div>
          </div>
        )}
      </div>
    </>
  )
}
