# Tunely

A frontend-only music platform — discover music, search a curated library, listen through an integrated player, explore artists and albums, and build persistent personal playlists. No backend, no accounts: everything runs in your browser.

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## Using your own music

Open `src/data/musicLibrary.js`. Each song is one object:

```js
{
  id: 'song-009',
  name: 'Your Song',
  artists: ['Artist Name'],   // array — supports multiple artists
  album: 'Album Name',        // or null if it has no album
  tags: ['Chill', 'Pop'],
  coverImage: 'https://...',                // external URL, or see below for local covers
  audioSrc: `${AUDIO_BASE}your-song.mp3`,    // AUDIO_BASE is defined at the top of the file
  releaseDate: '2024-01-01',
  duration: 210,               // seconds
}
```

Put your actual `.mp3` files in **`public/audio/`** (flat — no nested folder needed, `AUDIO_BASE` handles the site's base path automatically). For local cover images instead of external URLs, do the same with a `public/covers/` folder and a matching `COVER_BASE` constant.

**IDs must be unique.** Every lookup in the app (playlists, search, list rendering) resolves a song by its `id` — a duplicate silently makes one of the two songs unreachable.

## Project structure

```
src/
  data/musicLibrary.js     # the one source of truth for song metadata
  models/songQueries.js    # derives artists/albums/tags + search, from the library
  context/                 # ThemeContext, PlaylistContext, PlayerContext (global state)
  hooks/                   # useLocalStorage, useAudioPlayer
  components/               # cards, player bar, nav, search bar, modals
  pages/                    # Home, Search, Library, Artist/Album/Playlist detail
```

See the in-code comments — most files open with a short "Decision / Reason" note explaining why that piece is built the way it is.

## Deploying (one codebase, `main` branch, two hosts)

The site's base path comes from the `VITE_BASE_PATH` environment variable (default `/`).

- **Vercel** — import the repo, keep the defaults (`vercel.json` already sets Vite, `dist`, and the SPA rewrite). Nothing to configure.
- **GitHub Pages** — `.github/workflows/deploy.yml` builds on every push to `main` with `VITE_BASE_PATH=/<repo-name>/` and publishes `dist/`. In the repo: **Settings → Pages → Source → GitHub Actions** (one-time). Renaming the repo needs no code change.

Your `public/audio/` songs must be committed to `main` — both hosts build from the repo.

To test the GitHub Pages build locally: `VITE_BASE_PATH=/Tunely/ npm run build && npm run preview`.

## What's intentionally not included (V1)

Login/accounts, a backend, cloud sync, social features, and recommendations are out of scope for this version — see the architecture notes in-code for how the design leaves room to add them later without a rewrite.
