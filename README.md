# VibeStream

A music discovery and streaming app built with Next.js 15 and Supabase. Search the iTunes catalogue, build playlists, and listen to 30-second previews — all from a polished in-browser player.

## Features

### Search & Discovery
- **Music search** — debounced search against the iTunes API with paginated results
- **Curated homepage** — randomly-picked genre query on load so there's always something to explore
- **Song cards** — artwork thumbnails with always-visible play/pause buttons and add-to-playlist action

### Audio Playback
- **MiniPlayer** — fixed bottom bar with play/pause, ±10 s skip, seek bar, and volume control
  - Collapses to a slim progress-bar strip; expands to a full-panel view on mobile and desktop
  - Animated skip buttons (ripple + directional nudge on click)
- **Queue** — "Up Next" queue with auto-advance to the next song when a track ends

### Authentication
- **Email/password** sign up and login with Zod-validated forms
- **Google OAuth** one-click sign in
- **Password recovery** — reset-password and set-password flows
- **Auth middleware** — session refresh and route protection via Next.js middleware

### Playlists
- **Create, rename, and delete** playlists (up to 20 per user)
- **Add, remove, and reorder** songs within a playlist (up to 50 per playlist)
- **Row-level security** — Supabase RLS policies ensure users only see their own data

### Design
- **Dark mode** — system-preference-aware, toggle available in the header
- **Responsive** — single-column mobile layout, multi-column grid on larger screens
- **Design tokens** — CSS custom properties for colours, spacing, and theming

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| UI primitives | Radix UI |
| Auth & Database | Supabase (Auth + Postgres + RLS) |
| Audio | HTML5 `<audio>` via custom `useAudio` hook |
| Data | iTunes Search API (server-side proxy at `/api/itunes`) |
| Validation | Zod + `@t3-oss/env-nextjs` |
| Testing | Vitest + React Testing Library, Playwright (E2E) |
| Storybook | Component documentation and visual testing |
| CI/CD | GitHub Actions (typecheck, lint, tests, bundle analysis, E2E) |
| Package manager | pnpm |

## Getting started

### Prerequisites

- Node.js >= 20
- pnpm
- A [Supabase](https://supabase.com) project (for auth and playlists)

### Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database setup

Run the migration in your Supabase SQL editor to create the `playlists` and `playlist_songs` tables with RLS policies:

```bash
# The migration file is at:
supabase/migrations/create_playlists.sql
```

### Install & run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Development server (Turbopack, hot reload) |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm prettier` | Prettier check |
| `pnpm prettier:fix` | Prettier auto-fix |
| `pnpm test` | Vitest (watch mode) |
| `pnpm test --run` | Vitest (CI mode, single pass) |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm e2e:headless` | Playwright E2E tests |
| `pnpm e2e:ui` | Playwright E2E tests (interactive UI) |
| `pnpm storybook` | Storybook dev server on port 6006 |
| `pnpm analyze` | Bundle size analysis |

## Project structure

```
app/
  api/itunes/          # Server-side iTunes proxy (5-min cache)
  api/health/          # Health check endpoint
  auth/callback/       # Supabase OAuth callback handler
  (auth)/              # Auth route group (shared layout)
    login/             # Login page (email/password + Google)
    signup/            # Registration page
    reset-password/    # Password reset request
    set-password/      # Set new password
  playlists/           # Playlist list + create
    [id]/              # Individual playlist view
  layout.tsx           # Root layout (AuthProvider + MiniPlayer)
  page.tsx             # Homepage — search + song grid + pagination
components/
  auth/                # AuthProvider, GoogleButton, PasswordInput
  playlist/            # AddToPlaylistModal, PlaylistCard
  ui/                  # Radix-based primitives (Button, Card, Input, Slider, Skeleton)
  Header.tsx           # Logo + playlists link + theme toggle + user menu
  MiniPlayer.tsx       # Fixed player bar (collapsed + expanded + queue)
  SongCard.tsx         # Track card with play + add-to-playlist
  SearchBar.tsx        # Debounced search input
  UserMenu.tsx         # Profile dropdown with logout
  ThemeToggle.tsx      # Dark/light toggle
hooks/
  useAudio.ts          # Wires Zustand player state to HTMLAudioElement
  useAuthListener.ts   # Syncs Supabase auth state to Zustand store
  useItunesSearch.ts   # Search + pagination with AbortController
  usePlaylist.ts       # Playlist CRUD orchestration
  useRequireAuth.ts    # Redirect guard for protected pages
lib/
  audio.ts             # HTML5 Audio singleton (SSR-safe)
  itunes.ts            # fetchSongs(), pickDefaultQuery()
  supabase/            # Supabase clients (browser, server, middleware)
    playlists.ts       # Playlist CRUD queries
    playlist-songs.ts  # Song CRUD + reorder queries
  validation/auth.ts   # Zod schemas for auth forms
store/
  useAuthStore.ts      # Auth state (user, session, loading)
  usePlayerStore.ts    # Playback state (song, progress, volume, queue)
  usePlaylistStore.ts  # User playlists list
  useThemeStore.ts     # Theme preference (persisted)
constants/
  auth.ts              # Routes, redirects, error messages
  player.ts            # Artwork sizes, skip duration, animations
  playlist.ts          # Limits (20 playlists, 50 songs, 5 queue display)
types/
  auth.ts              # AuthState, AuthFormErrors, OAuthProvider
  itunes.ts            # ITunesSong, ITunesSearchResponse
  playlist.ts          # Playlist, PlaylistSong, PlaylistWithSongs
styles/
  tailwind.css         # Design tokens + custom keyframes
supabase/
  migrations/          # SQL migrations (playlists + RLS policies)
```

## License

MIT
