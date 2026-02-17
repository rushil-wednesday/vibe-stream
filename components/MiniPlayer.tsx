"use client"

import React, { useState } from "react"

import Image from "next/image"

import { ChevronDownIcon, PauseIcon, PlayIcon, SkipBack10Icon, SkipForward10Icon, VolumeIcon } from "assets/icons"
import { Slider } from "components/ui/Slider"
import { ARTWORK_SIZE_LARGE, ARTWORK_SIZE_SMALL, SKIP_SECONDS } from "constants/player"
import { useAudio } from "hooks/useAudio"
import { usePlayerStore } from "store/usePlayerStore"
import { getArtworkUrl } from "types/itunes"

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
 * Expanded state: large artwork, seek bar with times, ±10s controls, volume.
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
          "transition-all duration-300 ease-in-out",
          expanded ? "h-auto md:h-72" : "h-[68px]",
        ].join(" ")}
      >
        {/* Thin progress bar along top edge (visible in minimised state) */}
        {!expanded && (
          <div className="absolute top-0 right-0 left-0 h-0.5 bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full bg-violet-500 transition-all duration-300 dark:bg-violet-400"
              style={{ width: `${progress * 100}%` }}
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
          onKeyDown={(e) => e.key === "Enter" && setExpanded(true)}
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

          {/* Play/pause — stopPropagation so clicking it doesn't expand */}
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
        </div>

        {/* ── EXPANDED PANEL ── */}
        {expanded && (
          <div className="flex flex-col gap-4 px-6 pt-4 pb-8">
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

            <div className="flex items-center gap-6">
              {/* Large artwork */}
              <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-xl shadow-lg md:block">
                <Image
                  src={artworkLarge}
                  alt={currentSong.collectionName}
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Track info + controls */}
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div>
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

                {/* Playback controls */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSkip(-SKIP_SECONDS)}
                    aria-label="Skip back 10 seconds"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
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
                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <SkipForward10Icon />
                  </button>
                </div>

                {/* Volume row — visible on all screen sizes */}
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
