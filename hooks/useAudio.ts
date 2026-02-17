"use client"

import { useEffect, useRef } from "react"

import { usePlayerStore } from "store/usePlayerStore"

/**
 * useAudio — connects the HTML5 Audio singleton to the Zustand player store.
 *
 * This hook must be mounted once at the root level (MiniPlayer) so that it
 * persists across page navigations and keeps music playing during route changes.
 *
 * Responsibilities:
 * - Reacts to store.isPlaying / store.currentSong changes and calls audio APIs
 * - Wires timeupdate / ended / durationchange / volumechange events back into the store
 * - Uses a Zustand subscription (not useEffect) to forward user-initiated seeks
 *   to the audio element, avoiding the stale-ref trap of depending on [seek]
 */
export function useAudio() {
  const { currentSong, isPlaying, volume, setProgress, pause, resume, setVolume } = usePlayerStore()
  const prevSongRef = useRef<number | null>(null)
  // Tracks the last progress value written by the audio timeupdate event so we
  // can distinguish audio-driven updates from user-initiated seeks/skips.
  const audioProgressRef = useRef(0)

  // Wire up persistent event listeners + Zustand seek subscription (run once)
  useEffect(() => {
    let cleanup: (() => void) | undefined

    async function setup() {
      const { audio } = await import("lib/audio")

      const offTimeUpdate = audio.on("timeupdate", () => {
        const dur = audio.duration
        if (dur > 0) {
          const p = audio.currentTime / dur
          audioProgressRef.current = p
          setProgress(p, dur)
        }
      })

      const offEnded = audio.on("ended", () => {
        pause()
        setProgress(0, audio.duration)
      })

      // Sync audio element volume changes (e.g. mute toggle) back to the store
      const offVolumeChange = audio.on("volumechange", () => {
        setVolume(audio.volume)
      })

      // Sync play/pause state when the OS or keyboard media keys control the
      // audio element directly (bypassing the store).
      const offPlay = audio.on("play", () => {
        if (!usePlayerStore.getState().isPlaying) resume()
      })

      const offPause = audio.on("pause", () => {
        if (usePlayerStore.getState().isPlaying) pause()
      })

      // Subscribe to store progress changes to forward user seeks to audio element.
      // A Zustand subscription avoids the stale-function-ref problem of useEffect([seek]).
      const unsubSeek = usePlayerStore.subscribe((state, prev) => {
        if (state.progress === prev.progress) return
        // Skip if this change came from timeupdate (delta ≤ 0.01 of what we wrote)
        if (Math.abs(state.progress - audioProgressRef.current) <= 0.01) return
        audio.seek(state.progress)
      })

      cleanup = () => {
        offTimeUpdate()
        offEnded()
        offVolumeChange()
        offPlay()
        offPause()
        unsubSeek()
      }
    }

    void setup()
    return () => cleanup?.()
  }, [setProgress, pause, resume, setVolume])

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

  // Sync volume store → audio element
  useEffect(() => {
    import("lib/audio").then(({ audio }) => audio.setVolume(volume)).catch(() => undefined)
  }, [volume])
}
