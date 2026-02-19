import { createClient } from "lib/supabase/client"
import type { Playlist } from "types/playlist"

/** Fetch all playlists for the authenticated user, ordered by most recent */
export async function getPlaylists(): Promise<{ data: Playlist[] | null; error: string | null }> {
  const supabase = createClient()
  const { data, error } = await supabase.from("playlists").select("*").order("created_at", { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data as Playlist[], error: null }
}

/** Create a new playlist with the given name */
export async function createPlaylist(name: string): Promise<{ data: Playlist | null; error: string | null }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { data: null, error: "Not authenticated" }

  const { data, error } = await supabase.from("playlists").insert({ name, user_id: user.id }).select().single()

  if (error) return { data: null, error: error.message }
  return { data: data as Playlist, error: null }
}

/** Rename an existing playlist */
export async function renamePlaylist(
  playlistId: string,
  name: string
): Promise<{ data: Playlist | null; error: string | null }> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("playlists")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", playlistId)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as Playlist, error: null }
}

/** Delete a playlist and all its songs (cascade) */
export async function deletePlaylist(playlistId: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase.from("playlists").delete().eq("id", playlistId)

  return { error: error?.message ?? null }
}
