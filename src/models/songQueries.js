/*
  Decision: Artists, Albums and Tags are "system collections" (§12) — they
  are never stored as their own objects. They're computed on demand from
  musicLibrary. This is the "derived data" concept the brief asks us to
  learn: one source of truth, many views over it.
*/
import { musicLibrary } from '../data/musicLibrary';
import { getArtistPhoto } from '../data/artistPhotos';

export function getAllSongs() {
  return musicLibrary;
}

export function getSongById(id) {
  return musicLibrary.find((s) => s.id === id) || null;
}

export function getSongsByIds(ids) {
  // Preserve the requested order (important for playlists) and silently
  // drop ids that no longer resolve to a song (§39 — invalid id safety).
  return ids.map((id) => getSongById(id)).filter(Boolean);
}

/** Every unique artist name, with a song count, sorted alphabetically. */
export function getAllArtists() {
  const map = new Map();
  for (const song of musicLibrary) {
    for (const artist of song.artists) {
      map.set(artist, (map.get(artist) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, songCount]) => ({ id: name, name, songCount, photo: getArtistPhoto(name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getSongsByArtist(artistName) {
  return musicLibrary.filter((s) => s.artists.includes(artistName));
}

/** Every unique album name (album-less songs are excluded, not grouped as "None" — §11). */
export function getAllAlbums() {
  const map = new Map();
  for (const song of musicLibrary) {
    if (!song.album) continue;
    if (!map.has(song.album)) {
      map.set(song.album, { id: song.album, name: song.album, coverImage: song.coverImage, songCount: 0 });
    }
    map.get(song.album).songCount += 1;
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getSongsByAlbum(albumName) {
  return musicLibrary.filter((s) => s.album === albumName);
}

export function getAllTags() {
  const set = new Set();
  for (const song of musicLibrary) song.tags.forEach((t) => set.add(t));
  return Array.from(set).sort();
}

export function getSongsByTag(tag) {
  return musicLibrary.filter((s) => s.tags.includes(tag));
}

/*
  Search with simple relevance scoring (§14). Higher score wins; ties keep
  library order. This is intentionally simple — no fuzzy matching, no
  external search library — per the "don't overengineer" instruction.
*/
export function search(query) {
  const q = query.trim().toLowerCase();
  if (!q) return { songs: [], artists: [], albums: [] };

  const scored = musicLibrary
    .map((song) => {
      let score = 0;
      const title = song.name.toLowerCase();
      if (title === q) score += 100;
      else if (title.includes(q)) score += 60;

      if (song.artists.some((a) => a.toLowerCase() === q)) score += 50;
      else if (song.artists.some((a) => a.toLowerCase().includes(q))) score += 40;

      if (song.album && song.album.toLowerCase().includes(q)) score += 30;
      if (song.tags.some((t) => t.toLowerCase().includes(q))) score += 15;

      return { song, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.song);

  const artists = getAllArtists().filter((a) => a.name.toLowerCase().includes(q));
  const albums = getAllAlbums().filter((a) => a.name.toLowerCase().includes(q));

  return { songs: scored, artists, albums };
}
