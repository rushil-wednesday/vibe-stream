import { graphqlRequest } from "lib/graphql/client"
import type { ITunesSong } from "types/itunes"
import type { PlaylistSong } from "types/playlist"

interface MongoSongData {
  trackId: number
  trackName: string
  artistName: string
  collectionName: string
  artworkUrl100: string
  previewUrl: string
  trackTimeMillis: number
  primaryGenreName: string
  releaseDate: string
}

interface MongoPlaylistSong {
  _id: string
  playlistId: string
  songData: MongoSongData
  position: number
  createdAt: string
}

function mapPlaylistSong(s: MongoPlaylistSong): PlaylistSong {
  return {
    id: s._id,
    playlist_id: s.playlistId,
    song_data: s.songData,
    position: s.position,
    created_at: s.createdAt,
  }
}

const PLAYLIST_SONG_FIELDS = `
  _id
  playlistId
  songData {
    trackId
    trackName
    artistName
    collectionName
    artworkUrl100
    previewUrl
    trackTimeMillis
    primaryGenreName
    releaseDate
  }
  position
  createdAt
`

/** Fetch all songs in a playlist, ordered by position */
export async function getPlaylistSongs(
  playlistId: string
): Promise<{ data: PlaylistSong[] | null; error: string | null }> {
  const { data, error } = await graphqlRequest<{ playlistSongs: MongoPlaylistSong[] }>(
    `
    query PlaylistSongs($playlistId: MongoID!) {
      playlistSongs(playlistId: $playlistId) {
        ${PLAYLIST_SONG_FIELDS}
      }
    }
  `,
    { playlistId }
  )

  if (error || !data) return { data: null, error: error ?? "Failed to fetch songs" }
  return { data: data.playlistSongs.map(mapPlaylistSong), error: null }
}

/** Add a song to a playlist at the end (next available position) */
export async function addSongToPlaylist(
  playlistId: string,
  song: ITunesSong
): Promise<{ data: PlaylistSong | null; error: string | null }> {
  const { data, error } = await graphqlRequest<{ addSongToPlaylist: MongoPlaylistSong }>(
    `
    mutation AddSong($playlistId: MongoID!, $songData: SongDataInput!) {
      addSongToPlaylist(playlistId: $playlistId, songData: $songData) {
        ${PLAYLIST_SONG_FIELDS}
      }
    }
  `,
    {
      playlistId,
      songData: {
        trackId: song.trackId,
        trackName: song.trackName,
        artistName: song.artistName,
        collectionName: song.collectionName,
        artworkUrl100: song.artworkUrl100,
        previewUrl: song.previewUrl,
        trackTimeMillis: song.trackTimeMillis,
        primaryGenreName: song.primaryGenreName,
        releaseDate: song.releaseDate,
      },
    }
  )

  if (error || !data) return { data: null, error: error ?? "Failed to add song" }
  return { data: mapPlaylistSong(data.addSongToPlaylist), error: null }
}

/** Remove a song from a playlist */
export async function removeSongFromPlaylist(songId: string): Promise<{ error: string | null }> {
  const { error } = await graphqlRequest<{ removeSongFromPlaylist: MongoPlaylistSong }>(
    `
    mutation RemoveSong($songId: MongoID!) {
      removeSongFromPlaylist(songId: $songId) {
        _id
      }
    }
  `,
    { songId }
  )

  return { error: error ?? null }
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
  const { error } = await graphqlRequest<{ reorderSong: boolean }>(
    `
    mutation ReorderSong($playlistId: MongoID!, $songId: MongoID!, $newPosition: Int!) {
      reorderSong(playlistId: $playlistId, songId: $songId, newPosition: $newPosition)
    }
  `,
    { playlistId, songId, newPosition }
  )

  return { error: error ?? null }
}
