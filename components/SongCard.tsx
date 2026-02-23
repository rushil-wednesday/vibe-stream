"use client"

import Image from "next/image"
import React, { useState } from "react"

import { PauseIcon, PlayIcon, PlusIcon } from "assets/icons"
import { AddToPlaylistModal } from "components/playlist/AddToPlaylistModal"
import { Card } from "components/ui/Card"
import { Skeleton } from "components/ui/Skeleton"
import {
  ARTWORK_SIZE_CARD,
  EQ_BAR_BASE_DURATION,
  EQ_BAR_BASE_HEIGHT,
  EQ_BAR_DURATION_INCREMENT,
  EQ_BAR_HEIGHT_INCREMENT,
  PLAY_BUTTON_ICON_CLASS,
  PLAY_BUTTON_SIZE_CLASS,
} from "constants/player"
import { useAuthStore } from "store/useAuthStore"
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
  const user = useAuthStore((s) => s.user)
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)

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

  function handleAddToPlaylist(e: React.MouseEvent) {
    e.stopPropagation()
    setShowPlaylistModal(true)
  }

  const artworkSrc = getArtworkUrl(song.artworkUrl100, ARTWORK_SIZE_CARD)

  return (
    <>
      {showPlaylistModal && <AddToPlaylistModal song={song} onClose={() => setShowPlaylistModal(false)} />}
      <Card
        variant={isCurrentSong ? "playing" : "interactive"}
        onClick={() => play(song)}
        role="button"
        tabIndex={0}
        aria-label={`${isThisPlaying ? "Pause" : "Play"} ${song.trackName} by ${song.artistName}`}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && play(song)}
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

          {/* Add to playlist button (top-left, only for authenticated users) */}
          {user && (
            <button
              type="button"
              onClick={handleAddToPlaylist}
              aria-label="Add to playlist"
              className="absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-opacity duration-200 hover:bg-white dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          )}

          {/* Play/pause button — always visible, bottom-right */}
          <button
            type="button"
            onClick={handlePlayPause}
            aria-label={isThisPlaying ? "Pause" : "Play"}
            className={[
              "absolute right-2 bottom-2 z-10",
              "flex items-center justify-center rounded-full shadow-md",
              "transition-colors duration-200",
              "focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none",
              PLAY_BUTTON_SIZE_CLASS,
              isThisPlaying
                ? "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
                : "bg-white/90 text-gray-900 hover:bg-white dark:bg-gray-800/90 dark:text-gray-100 dark:hover:bg-gray-800",
            ].join(" ")}
          >
            {isThisPlaying ? (
              <PauseIcon className={PLAY_BUTTON_ICON_CLASS} />
            ) : (
              <PlayIcon className={PLAY_BUTTON_ICON_CLASS} />
            )}
          </button>

          {/* Currently-playing animated indicator */}
          {isThisPlaying && (
            <div className="absolute bottom-2 left-2 flex items-end gap-[2px]">
              {[1, 2, 3].map((bar) => (
                <span
                  key={bar}
                  className="w-[3px] rounded-sm bg-white"
                  style={{
                    height: `${EQ_BAR_BASE_HEIGHT + bar * EQ_BAR_HEIGHT_INCREMENT}px`,
                    animation: `equalizerBar ${EQ_BAR_BASE_DURATION + bar * EQ_BAR_DURATION_INCREMENT}s ease-in-out infinite alternate`,
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
    </>
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
