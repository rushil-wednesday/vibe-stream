import { graphqlRequest } from "lib/graphql/client"
import type { Playlist } from "types/playlist"

interface MongoPlaylist {
  _id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
}

function mapPlaylist(p: MongoPlaylist): Playlist {
  return {
    id: p._id,
    user_id: p.userId,
    name: p.name,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }
}

/** Fetch all playlists for the authenticated user, ordered by most recent */
export async function getPlaylists(): Promise<{ data: Playlist[] | null; error: string | null }> {
  const { data, error } = await graphqlRequest<{ myPlaylists: MongoPlaylist[] }>(`
    query {
      myPlaylists {
        _id
        userId
        name
        createdAt
        updatedAt
      }
    }
  `)

  if (error || !data) return { data: null, error: error ?? "Failed to fetch playlists" }
  return { data: data.myPlaylists.map(mapPlaylist), error: null }
}

/** Create a new playlist with the given name */
export async function createPlaylist(name: string): Promise<{ data: Playlist | null; error: string | null }> {
  const { data, error } = await graphqlRequest<{ createPlaylist: MongoPlaylist }>(
    `
    mutation CreatePlaylist($name: String!) {
      createPlaylist(name: $name) {
        _id
        userId
        name
        createdAt
        updatedAt
      }
    }
  `,
    { name }
  )

  if (error || !data) return { data: null, error: error ?? "Failed to create playlist" }
  return { data: mapPlaylist(data.createPlaylist), error: null }
}

/** Rename an existing playlist */
export async function renamePlaylist(
  playlistId: string,
  name: string
): Promise<{ data: Playlist | null; error: string | null }> {
  const { data, error } = await graphqlRequest<{ renamePlaylist: MongoPlaylist }>(
    `
    mutation RenamePlaylist($id: MongoID!, $name: String!) {
      renamePlaylist(id: $id, name: $name) {
        _id
        userId
        name
        createdAt
        updatedAt
      }
    }
  `,
    { id: playlistId, name }
  )

  if (error || !data) return { data: null, error: error ?? "Failed to rename playlist" }
  return { data: mapPlaylist(data.renamePlaylist), error: null }
}

/** Delete a playlist and all its songs (cascade) */
export async function deletePlaylist(playlistId: string): Promise<{ error: string | null }> {
  const { error } = await graphqlRequest<{ deletePlaylist: MongoPlaylist }>(
    `
    mutation DeletePlaylist($id: MongoID!) {
      deletePlaylist(id: $id) {
        _id
      }
    }
  `,
    { id: playlistId }
  )

  return { error: error ?? null }
}
