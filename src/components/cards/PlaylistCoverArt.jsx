import './PlaylistCoverArt.css';

/*
  Decision: cover resolution logic lives in ONE place so PlaylistCard and
  PlaylistDetail (and anywhere else) render identically:
  - a user-picked custom cover (playlist.coverSongIds, exactly 4 songs) wins if present
  - otherwise, 4+ songs in the playlist → auto mosaic of its first 4 songs
  - otherwise (1-3 songs) → the first song's own cover, single image
  - 0 songs → a neutral placeholder, no crash
*/
export function resolveCoverSongs(playlist, allPlaylistSongs) {
  if (playlist.coverSongIds && playlist.coverSongIds.length === 4) {
    const bySongId = new Map(allPlaylistSongs.map((s) => [s.id, s]));
    const picked = playlist.coverSongIds.map((id) => bySongId.get(id)).filter(Boolean);
    if (picked.length === 4) return picked;
  }
  return allPlaylistSongs.slice(0, 4);
}

export function PlaylistCoverArt({ songs, size = 'md' }) {
  if (!songs || songs.length === 0) {
    return (
      <div className={`playlist-cover playlist-cover-${size} playlist-cover-empty`} aria-hidden="true">
        ♪
      </div>
    );
  }

  if (songs.length < 4) {
    return (
      <div className={`playlist-cover playlist-cover-${size}`}>
        <img src={songs[0].coverImage} alt="" loading="lazy" />
      </div>
    );
  }

  return (
    <div className={`playlist-cover playlist-cover-${size} playlist-cover-mosaic`}>
      {songs.slice(0, 4).map((song, i) => (
        <img key={song.id + i} src={song.coverImage} alt="" loading="lazy" />
      ))}
    </div>
  );
}
