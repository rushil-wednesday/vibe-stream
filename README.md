# VibeStream

A music discovery and streaming app built with Next.js 15. Search the iTunes catalogue, browse curated results, and listen to 30-second previews — all from a polished in-browser player.

## Features

- **Music search** — debounced search against the iTunes API with paginated results
- **Curated homepage** — randomly-picked genre query on load so there's always something to explore
- **MiniPlayer** — fixed bottom bar with play/pause, ±10 s skip, seek bar, and volume control
  - Collapses to a slim progress-bar strip; expands to a full-panel view on mobile and desktop
  - Animated skip buttons (ripple + directional nudge on click)
- **Dark mode** — system-preference-aware, toggle available in the header
- **Responsive** — single-column mobile layout, multi-column grid on larger screens

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| UI primitives | Radix UI |
| Audio | HTML5 `<audio>` via custom `useAudio` hook |
| Data | iTunes Search API (server-side proxy at `/api/itunes`) |
| Testing | Vitest + React Testing Library |
| Package manager | pnpm |

## Getting started

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev          # Development server (hot reload)
pnpm build        # Production build
pnpm start        # Serve production build
pnpm lint         # ESLint
pnpm prettier     # Prettier check
pnpm prettier:fix # Prettier auto-fix
pnpm test         # Vitest (watch mode)
pnpm test --run   # Vitest (CI mode, single pass)
pnpm analyze      # Bundle size analysis
```

## Project structure

```
app/
  api/itunes/     # Server-side iTunes proxy (avoids CORS)
  layout.tsx      # Root layout + MiniPlayer mount
  page.tsx        # Homepage — search + song grid + pagination
components/
  MiniPlayer.tsx  # Fixed player bar (collapsed + expanded states)
  SongCard.tsx    # Individual track card
  SearchBar.tsx   # Debounced search input
  Header.tsx      # Logo + theme toggle
hooks/
  useAudio.ts     # Wires Zustand player state to HTMLAudioElement
  useItunesSearch.ts  # Search + pagination logic with AbortController
lib/
  itunes.ts       # fetchSongs(), pickDefaultQuery()
store/
  usePlayerStore.ts   # Global audio state (Zustand)
styles/
  tailwind.css    # Design tokens + custom keyframes
types/
  itunes.ts       # iTunes API response types
```

## License

MIT
