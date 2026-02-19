import "styles/tailwind.css"

import type { Metadata } from "next"
import Script from "next/script"

import { THEME_DARK, THEME_LIGHT } from "constants/theme"

import { MiniPlayer } from "components/MiniPlayer"

export const metadata: Metadata = {
  title: "VibeStream",
  description: "Music discovery and streaming powered by iTunes",
}

/**
 * Flash-Of-Wrong-Theme (FOWT) prevention script.
 * Runs synchronously before React hydrates — reads localStorage and applies
 * the .dark class to <html> so there is never a flicker on page load.
 * Falls back to the OS prefers-color-scheme if no stored preference exists.
 */
const fowt = `
(function() {
  try {
    var stored = localStorage.getItem('vibe-stream-theme');
    var parsed = stored ? JSON.parse(stored) : null;
    var theme = parsed && parsed.state && parsed.state.theme;
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? '${THEME_DARK}' : '${THEME_LIGHT}';
    }
    document.documentElement.classList.add(theme);
  } catch (e) {
    document.documentElement.classList.add('${THEME_DARK}');
  }
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* FOWT prevention — must be the first script in <head> */}
        <Script id="fowt" strategy="beforeInteractive">
          {fowt}
        </Script>
      </head>
      {/* pb-[68px] prevents content from hiding behind the MiniPlayer bar */}
      <body className="pb-[68px]">
        {children}
        {/* MiniPlayer is at root so it persists across all page navigations */}
        <MiniPlayer />
      </body>
    </html>
  )
}
