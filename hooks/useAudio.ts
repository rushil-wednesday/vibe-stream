"use client"

import { useEffect, useRef } from "react"

import { usePlayerStore } from "store/usePlayerStore"

/**
 * useAudio — connects the HTML5 Audio singleton to the Zustand player store.
 *
 * This hook must be mounted once at the root level (layout.tsx) so that it
 * persists across page navigations and keeps music playing during route changes.
 *
 * Responsibilities:
 * - Reacts to store.isPlaying / store.currentSong changes and calls audio APIs
 * - Wires timeupdate / ended / durationchange events back into the store
 * - Syncs volume changes from the store to the Audio element
 */
export function useAudio() {
  const { currentSong, isPlaying, volume, seek, setProgress, pause } = usePlayerStore()
  const prevSongRef = useRef<number | null>(null)

  // Lazy-import audio only in the browser to avoid SSR crashes
  useEffect(() => {
    let cleanup: (() => void) | undefined

    async function setup() {
      const { audio } = await import("lib/audio")

      // Wire up persistent event listeners (run once)
      const offTimeUpdate = audio.on("timeupdate", () => {
        const dur = audio.duration
        if (dur > 0) {
          setProgress(audio.currentTime / dur, dur)
        }
      })

      const offEnded = audio.on("ended", () => {
        pause()
        setProgress(0, audio.duration)
      })

      cleanup = () => {
        offTimeUpdate()
        offEnded()
      }
    }

    void setup()
    return () => cleanup?.()
  }, [setProgress, pause])

  // React to song / playback state changes
  useEffect(() => {
    if (!currentSong) return

    async function syncPlayback() {
      if (!currentSong) return
      const { audio } = await import("lib/audio")

      const isSameSong = prevSongRef.current === currentSong.trackId
      prevSongRef.current = currentSong.trackId

      if (isPlaying) {
        try {
          if (isSameSong) {
            await audio.resume()
          } else {
            await audio.play(currentSong.previewUrl)
          }
        } catch {
          // Autoplay policy or network error — revert play state
          pause()
        }
      } else {
        audio.pause()
      }
    }

    void syncPlayback()
  }, [currentSong, isPlaying, pause])

  // Sync volume
  useEffect(() => {
    import("lib/audio").then(({ audio }) => audio.setVolume(volume)).catch(() => undefined)
  }, [volume])

  // Sync seek: when store.progress is set externally (from Slider drag),
  // forward the seek to the Audio element
  const prevProgress = useRef(0)
  useEffect(() => {
    const { progress } = usePlayerStore.getState()
    // Only seek when the change looks like a user drag (not a timeupdate)
    const delta = Math.abs(progress - prevProgress.current)
    prevProgress.current = progress
    if (delta > 0.01) {
      import("lib/audio").then(({ audio }) => audio.seek(progress)).catch(() => undefined)
    }
  }, [seek])
}
