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

/**
 * Skip-back 10 s — 270° counter-clockwise arc (3 o'clock → 12 o'clock),
 * arrowhead at 12 o'clock pointing LEFT to indicate backward direction.
 * Center (12,12), radius 8.
 */
function SkipBack10Icon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      {/* 270° CCW arc: (20,12) → (12,4) */}
      <path d="M20 12A8 8 0 1 0 12 4" strokeLinecap="round" />
      {/* Arrowhead at (12,4) pointing LEFT — wings extend right */}
      <path d="M13.5 2.5L12 4L13.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="12" y="14.5" fontSize="6.5" fill="currentColor" stroke="none" fontWeight="bold" textAnchor="middle">
        10
      </text>
    </svg>
  )
}

/**
 * Skip-forward 10 s — 270° clockwise arc (9 o'clock → 12 o'clock),
 * arrowhead at 12 o'clock pointing RIGHT to indicate forward direction.
 * Center (12,12), radius 8.
 */
function SkipForward10Icon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      {/* 270° CW arc: (4,12) → (12,4) */}
      <path d="M4 12A8 8 0 1 1 12 4" strokeLinecap="round" />
      {/* Arrowhead at (12,4) pointing RIGHT — wings extend left */}
      <path d="M10.5 2.5L12 4L10.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="12" y="14.5" fontSize="6.5" fill="currentColor" stroke="none" fontWeight="bold" textAnchor="middle">
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
            <div className="flex items-center gap-1">
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
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none dark:bg-violet-500 dark:hover:bg-violet-400"
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
            <div className="flex items-center justify-center gap-6 md:gap-4">
              <button
                type="button"
                onClick={() => handleSkip(-SKIP_SECONDS)}
                aria-label="Skip back 10 seconds"
                className="flex h-[54px] w-[54px] items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 md:h-9 md:w-9 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <SkipBack10Icon className="h-7 w-7 md:h-6 md:w-6" />
              </button>

              <button
                type="button"
                onClick={handlePlayPause}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-violet-600 text-white shadow-md hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none md:h-12 md:w-12 dark:bg-violet-500 dark:hover:bg-violet-400"
              >
                {isPlaying ? (
                  <PauseIcon className="h-8 w-8 md:h-5 md:w-5" />
                ) : (
                  <PlayIcon className="h-8 w-8 md:h-5 md:w-5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSkip(SKIP_SECONDS)}
                aria-label="Skip forward 10 seconds"
                className="flex h-[54px] w-[54px] items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 md:h-9 md:w-9 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <SkipForward10Icon className="h-7 w-7 md:h-6 md:w-6" />
              </button>
            </div>

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
