"use client"

import Link from "next/link"

import { PlaylistIcon } from "assets/icons"
import { Card } from "components/ui/Card"
import type { Playlist } from "types/playlist"

interface PlaylistCardProps {
  playlist: Playlist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link href={`/playlists/${playlist.id}`}>
      <Card variant="interactive">
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
            <PlaylistIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{playlist.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(playlist.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
