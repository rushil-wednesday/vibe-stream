/**
 * HTML5 Audio singleton.
 *
 * A single Audio instance is shared across the entire app so that music
 * continues playing during page navigations (future multi-page support).
 * The instance is created lazily — never imported at module scope on the
 * server (guards against SSR errors).
 */

let audioInstance: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement {
  if (typeof window === "undefined") {
    throw new Error("Audio is only available in the browser")
  }
  if (!audioInstance) {
    audioInstance = new Audio()
    audioInstance.preload = "metadata"
  }
  return audioInstance
}

export const audio = {
  /**
   * Load a new source URL and start playback.
   * Returns a promise that resolves when playback begins.
   */
  play(src: string): Promise<void> {
    const el = getAudio()
    if (el.src !== src) {
      el.src = src
      el.load()
    }
    return el.play()
  },

  pause(): void {
    audioInstance?.pause()
  },

  resume(): Promise<void> {
    return getAudio().play()
  },

  /** Seek to a position (0–1 as a fraction of total duration) */
  seek(fraction: number): void {
    const el = getAudio()
    if (el.duration) {
      el.currentTime = fraction * el.duration
    }
  },

  /** Set volume (0–1) */
  setVolume(vol: number): void {
    getAudio().volume = Math.max(0, Math.min(1, vol))
  },

  get currentTime(): number {
    return audioInstance?.currentTime ?? 0
  },

  get duration(): number {
    return audioInstance?.duration ?? 0
  },

  get volume(): number {
    return audioInstance?.volume ?? 1
  },

  /**
   * Register an event listener on the underlying HTMLAudioElement.
   * Returns a cleanup function.
   */
  on<K extends keyof HTMLMediaElementEventMap>(
    event: K,
    handler: (e: HTMLMediaElementEventMap[K]) => void
  ): () => void {
    const el = getAudio()
    el.addEventListener(event, handler)
    return () => el.removeEventListener(event, handler)
  },
}
