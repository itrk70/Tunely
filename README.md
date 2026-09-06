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

## Deploying to GitHub Pages

1. `npm run build` — outputs static files to `dist/`.
2. Push `dist/` to a `gh-pages` branch (or use the `gh-pages` npm package), or point GitHub Pages at the `dist` folder via GitHub Actions.
3. `vite.config.js` sets `base: '/Tunely/'` — this must exactly match your repo name. **If you rename the GitHub repo, update this one line** (and nothing else needs to change, since all runtime paths read from it via `import.meta.env.BASE_URL`).

## What's intentionally not included (V1)

Login/accounts, a backend, cloud sync, social features, and recommendations are out of scope for this version — see the architecture notes in-code for how the design leaves room to add them later without a rewrite.
