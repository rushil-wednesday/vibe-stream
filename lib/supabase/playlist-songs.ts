import { createClient } from "lib/supabase/client"
import type { ITunesSong } from "types/itunes"
import type { PlaylistSong } from "types/playlist"

/** Fetch all songs in a playlist, ordered by position */
export async function getPlaylistSongs(
  playlistId: string
): Promise<{ data: PlaylistSong[] | null; error: string | null }> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("playlist_songs")
    .select("*")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true })

  if (error) return { data: null, error: error.message }
  return { data: data as PlaylistSong[], error: null }
}

/** Add a song to a playlist at the end (next available position) */
export async function addSongToPlaylist(
  playlistId: string,
  song: ITunesSong
): Promise<{ data: PlaylistSong | null; error: string | null }> {
  const supabase = createClient()

  // Get the current max position
  const { data: existing } = await supabase
    .from("playlist_songs")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1)

  const nextPosition = existing && existing.length > 0 ? (existing[0] as { position: number }).position + 1 : 0

  const { data, error } = await supabase
    .from("playlist_songs")
    .insert({
      playlist_id: playlistId,
      song_data: song,
      position: nextPosition,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as PlaylistSong, error: null }
}

/** Remove a song from a playlist */
export async function removeSongFromPlaylist(songId: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase.from("playlist_songs").delete().eq("id", songId)

  return { error: error?.message ?? null }
}

/**
 * Move a song to a new position within a playlist.
 * Shifts other songs to maintain contiguous ordering.
 */
export async function reorderSong(
  playlistId: string,
  songId: string,
  newPosition: number
): Promise<{ error: string | null }> {
  const supabase = createClient()

  // Fetch all songs in order
  const { data: songs, error: fetchError } = await supabase
    .from("playlist_songs")
    .select("id, position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true })

  if (fetchError) return { error: fetchError.message }
  if (!songs) return { error: "No songs found" }

  const typedSongs = songs as { id: string; position: number }[]

  // Remove the target song and reinsert at new position
  const currentIndex = typedSongs.findIndex((s) => s.id === songId)
  if (currentIndex === -1) return { error: "Song not found in playlist" }

  const reordered = [...typedSongs]
  const [moved] = reordered.splice(currentIndex, 1)
  if (!moved) return { error: "Song not found" }
  reordered.splice(newPosition, 0, moved)

  // Batch update all positions
  const updates = reordered.map((song, index) =>
    supabase.from("playlist_songs").update({ position: index }).eq("id", song.id)
  )

  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)
  if (failed?.error) return { error: failed.error.message }

  return { error: null }
}
