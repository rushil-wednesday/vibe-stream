import type { ITunesSong } from "types/itunes"

/** A user-created playlist stored in Supabase */
export interface Playlist {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

/** A song entry within a playlist, with position for ordering */
export interface PlaylistSong {
  id: string
  playlist_id: string
  song_data: ITunesSong
  position: number
  created_at: string
}

/** Playlist with its songs pre-loaded and song count */
export interface PlaylistWithSongs extends Playlist {
  songs: PlaylistSong[]
  song_count: number
}
