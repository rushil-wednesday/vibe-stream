import { create } from "zustand"

import type { ITunesSong } from "types/itunes"

export interface PlayerState {
  currentSong: ITunesSong | null
  isPlaying: boolean
  /** Playback progress as a 0–1 fraction */
  progress: number
  /** Total duration in seconds */
  duration: number
  /** Volume 0–1 */
  volume: number

  play: (song: ITunesSong) => void
  pause: () => void
  resume: () => void
  seek: (fraction: number) => void
  setVolume: (vol: number) => void
  setProgress: (progress: number, duration: number) => void
  reset: () => void
}

/**
 * Zustand store for audio playback state.
 *
 * Audio side-effects (play/pause/seek) are handled in the useAudio hook
 * which subscribes to this store. The store itself only tracks state.
 */
export const usePlayerStore = create<PlayerState>()((set, get) => ({
  currentSong: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 1,

  play: (song) => {
    const current = get().currentSong
    if (current?.trackId === song.trackId) {
      // Same song — just resume
      set({ isPlaying: true })
    } else {
      // New song — reset progress, switch track
      set({ currentSong: song, isPlaying: true, progress: 0, duration: 0 })
    }
  },

  pause: () => set({ isPlaying: false }),

  resume: () => {
    if (get().currentSong) set({ isPlaying: true })
  },

  seek: (fraction) => {
    set({ progress: Math.max(0, Math.min(1, fraction)) })
  },

  setVolume: (vol) => set({ volume: Math.max(0, Math.min(1, vol)) }),

  setProgress: (progress, duration) => set({ progress, duration }),

  reset: () => set({ currentSong: null, isPlaying: false, progress: 0, duration: 0 }),
}))
