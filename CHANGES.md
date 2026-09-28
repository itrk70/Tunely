# Tunely — PWA Fix + Queue System + Cover Visibility + Real Recently Played

Copy these into your project at the SAME paths shown (mirrors `src/`,
`public/`, and the two root config files). Doesn't touch
`src/data/musicLibrary.js` or `artistPhotos.js` — your songs are safe.

## 🆕 NEW files

- public/icons/pwa-192x192.png
- public/icons/pwa-512x512.png
- public/icons/pwa-512x512-maskable.png
- src/components/player/QueueDrawer.jsx
- src/components/player/QueueDrawer.css

## ✏️ MODIFIED files (overwrite your existing copies)

- vite.config.js
- package.json
- src/context/PlayerContext.jsx
- src/components/cards/SongCard.jsx
- src/components/cards/PlaylistCard.jsx
- src/components/cards/Card.css
- src/components/player/PlayerIcons.jsx
- src/components/player/PlayerBar.jsx
- src/components/player/PlayerBar.css
- src/pages/Playlists.jsx
- src/pages/Home.jsx

---

## 1. PWA install fix (the actual bug you reported)

**Root cause:** there was no web app manifest or service worker in the
project at all — so mobile Chrome's install action had nothing telling
it a `start_url`/`scope`, and fell back to guessing (badly).

**Fix:** added the `vite-plugin-pwa` package (standard, well-maintained
tool for exactly this) and configured it in `vite.config.js`:

```js
const BASE_PATH = '/Tunely/';   // ← single source of truth, used below AND as Vite's own `base`
...
manifest: {
  start_url: BASE_PATH,
  scope: BASE_PATH,
  ...
}
```

Both `start_url` and `scope` now resolve to exactly `/Tunely/`, matching
your deployed URL. `package.json` got the new dependency; `index.html`
needed NO manual changes — the plugin auto-injects the `<link
rel="manifest">` tag and service worker registration script into the
built HTML for you.

Three icon files were generated (a simple on-brand green music-note
icon) at 192×192, 512×512, and a padded 512×512 "maskable" variant for
Android's adaptive icon masking — manifests require real icon files to
be installable at all.

## 2. Playlist cover — now editable from the grid, not just inside a playlist

`PlaylistCard.jsx` gained an optional `onEditCover` prop; when supplied
(now wired up in `Playlists.jsx`), a hover "✎" button appears directly
on the card in the **My Playlists** grid for any playlist with 4+
songs — no need to open it first. (Its internal markup changed from one
big `<Link>` to a `<div>` with two separate links, since a button can't
be nested inside an `<a>` — see the comment in the file.)

## 3. "Add to Queue" + Queue drawer

- **SongCard** — new hover button on the **left** side of every song
  cover (mirroring "add to playlist" on the right) that calls
  `addToQueue(song)` directly — no picker needed, it's a one-step action.
- **PlayerContext** — added `addToQueue`, `upNext` (everything after
  the currently playing track), and `reorderQueue(fromIndex, toIndex)`
  (indices are positions within `upNext`, so dragging can only ever
  reorder upcoming songs — the currently playing track and history are
  left alone).
- **QueueDrawer** (new) — slides in from the right when you tap the new
  Queue button in the player bar (placed just before the volume
  control, as requested). Shows "Now Playing" up top, then "Up Next" —
  each row is drag-and-drop reorderable, plus keyboard-accessible ↑/↓
  buttons for the same reason the playlist reorder UI has them
  (accessibility — dragging isn't usable with a keyboard or a screen
  reader).

## 4. Recently Played — now real listen history

`PlayerContext` now tracks actual playback in `localStorage`
(`tunely:recentlyPlayed`) — most-recent-first, deduped (replaying a
song moves it back to the front instead of duplicating), capped at 20.
It's recorded through a shared `startPlayback()` used by every code
path that starts a new track — manual play, skip, and auto-advance —
so nothing slips through uncounted.

`Home.jsx`'s Recently Played section now resolves this history via
`getSongsByIds`, falling back to a curated slice only for a brand-new
visitor who hasn't played anything yet (so the section is never blank).

---

## Rebuild & redeploy

```bash
npm install       # pulls in the new vite-plugin-pwa dependency
npm run build
npm run deploy     # if you're using the gh-pages script from before —
                    # otherwise push dist/ to your gh-pages branch as usual
```

## After deploying — testing the PWA fix specifically

Mobile Chrome caches the old (broken) install shortcut and manifest, so:

1. **Uninstall** the currently-installed Tunely shortcut from your phone first.
2. Visit `https://itrk70.github.io/Tunely/` fresh (a hard refresh / clear
   site data helps make sure you're not seeing a cached old version).
3. Use Chrome's "Install app" / "Add to Home screen" again.
4. It should now open `.../Tunely/`, not the domain root.

You can also sanity-check the manifest itself anytime without
reinstalling: desktop Chrome → DevTools → **Application** tab →
**Manifest** — it'll show the resolved `start_url` and `scope` directly.
