"use client"

import React from "react"

import Image from "next/image"

import { PauseIcon, PlayIcon } from "assets/icons"
import { Card } from "components/ui/Card"
import { Skeleton } from "components/ui/Skeleton"
import { usePlayerStore } from "store/usePlayerStore"
import { getArtworkUrl } from "types/itunes"
import type { ITunesSong } from "types/itunes"

interface SongCardProps {
  song: ITunesSong
}

/**
 * SongCard — displays album artwork, track info, and a play/pause button.
 *
 * Uses a fine-grained Zustand selector so that only the cards whose play
 * state actually changed will re-render.
 */
export function SongCard({ song }: SongCardProps) {
  // Granular selector: only re-render when THIS song's play state changes
  const isThisPlaying = usePlayerStore((s) => s.currentSong?.trackId === song.trackId && s.isPlaying)
  const isCurrentSong = usePlayerStore((s) => s.currentSong?.trackId === song.trackId)
  const play = usePlayerStore((s) => s.play)
  const pause = usePlayerStore((s) => s.pause)
  const resume = usePlayerStore((s) => s.resume)

  function handlePlayPause(e: React.MouseEvent) {
    e.stopPropagation()
    if (isThisPlaying) {
      pause()
    } else if (isCurrentSong) {
      resume()
    } else {
      play(song)
    }
  }

  const artworkSrc = getArtworkUrl(song.artworkUrl100, 300)

  return (
    <Card
      variant={isCurrentSong ? "playing" : "interactive"}
      onClick={() => play(song)}
      role="button"
      tabIndex={0}
      aria-label={`${isThisPlaying ? "Pause" : "Play"} ${song.trackName} by ${song.artistName}`}
      onKeyDown={(e) => e.key === "Enter" && play(song)}
    >
      {/* Artwork */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={artworkSrc}
          alt={`${song.collectionName} album artwork`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />

        {/* Play/pause overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 hover:bg-black/30">
          <button
            type="button"
            onClick={handlePlayPause}
            aria-label={isThisPlaying ? "Pause" : "Play"}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-900 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 hover:bg-white focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
          >
            {isThisPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>

        {/* Currently-playing animated indicator */}
        {isThisPlaying && (
          <div className="absolute right-2 bottom-2 flex items-end gap-[2px]">
            {[1, 2, 3].map((bar) => (
              <span
                key={bar}
                className="w-[3px] rounded-sm bg-white"
                style={{
                  height: `${8 + bar * 4}px`,
                  animation: `equalizerBar ${0.5 + bar * 0.15}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{song.trackName}</p>
        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{song.artistName}</p>
        <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">{song.collectionName}</p>
      </div>
    </Card>
  )
}

/** Skeleton placeholder while songs are loading */
export function SongCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl">
      <Skeleton variant="card" className="aspect-square w-full" />
      <div className="space-y-2 p-3">
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-3 w-1/2" />
        <Skeleton variant="text" className="h-3 w-2/3" />
      </div>
    </div>
  )
}
