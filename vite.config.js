import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Single source of truth for the site's base path — Vite's own asset base
// and the PWA manifest's start_url/scope all read from this ONE constant.
//
//   Vercel / local dev / custom domain  -> '/'          (default, nothing to set)
//   GitHub Pages (project site)         -> '/<repo>/'   (the GitHub Actions
//                                          workflow sets VITE_BASE_PATH for you)
//
// So the SAME code on the main branch works on both hosts with no edits.
let BASE_PATH = process.env.VITE_BASE_PATH || '/';
if (!BASE_PATH.startsWith('/')) BASE_PATH = '/' + BASE_PATH;
if (!BASE_PATH.endsWith('/')) BASE_PATH += '/';

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    VitePWA({
      // 'autoUpdate' silently activates a new service worker version on
      // the next page load instead of asking the user — the right choice
      // for a small portfolio app with no "update available" UI.
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Tunely — Feel the music',
        short_name: 'Tunely',
        description:
          'Discover, search, and play music from a curated library. Build your own playlists.',
        /*
          PWA fix: an installed PWA's launch URL and navigation boundary
          come from the manifest's `start_url` and `scope` — NOT from
          whatever URL happened to be open when "Install" was tapped.
          Without an explicit manifest (none existed before this), mobile
          Chrome falls back to guessing, which is what launched the
          domain root instead of the actual app path.
          Both are set to the exact same BASE_PATH used above, so they
          always resolve to "/Tunely/" in the built, deployed site.
        */
        start_url: BASE_PATH,
        scope: BASE_PATH,
        display: 'standalone',
        background_color: '#0f0f13',
        theme_color: '#0f0f13',
        icons: [
          { src: 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'icons/pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
