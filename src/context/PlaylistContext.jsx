import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/idGenerator';
import { getSongsByIds } from '../models/songQueries';

const PlaylistContext = createContext(null);

/*
  Decision: playlists store only { id, name, songIds, coverSongIds,
  createdAt, updatedAt }. Full song objects are resolved on demand via
  getSongsByIds(), which reads from the music library (the single
  source of truth, §8). This means deleting a playlist can never touch
  the library, and the library can never go stale inside a playlist.

  `coverSongIds` (optional) is the user's manual pick of up to 4 songs
  from that playlist to build its cover collage. When absent, the cover
  falls back automatically to the playlist's own first 4 songs — see
  PlaylistCoverArt.jsx, which does that fallback at render time so
  there's nothing to keep in sync here.
*/
export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useLocalStorage('tunely:playlists', []);

  const createPlaylist = (name) => {
    const playlist = {
      id: generateId('playlist'),
      name: name.trim() || 'Untitled Playlist',
      songIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setPlaylists((prev) => [...prev, playlist]);
    return playlist.id;
  };

  const renamePlaylist = (playlistId, newName) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, name: newName.trim() || p.name, updatedAt: Date.now() } : p))
    );
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  };

  const addSongToPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId], updatedAt: Date.now() }
          : p
      )
    );
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? {
              ...p,
              songIds: p.songIds.filter((id) => id !== songId),
              // If the removed song was part of a custom cover pick,
              // drop it from there too so the cover never points at a
              // song no longer in the playlist.
              coverSongIds: p.coverSongIds ? p.coverSongIds.filter((id) => id !== songId) : p.coverSongIds,
              updatedAt: Date.now(),
            }
          : p
      )
    );
  };

  /** Set (or clear, by passing []) the user's custom cover-art song picks. */
  const setPlaylistCover = (playlistId, songIds) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, coverSongIds: songIds, updatedAt: Date.now() } : p))
    );
  };

  const reorderPlaylist = (playlistId, fromIndex, toIndex) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        const songIds = [...p.songIds];
        const [moved] = songIds.splice(fromIndex, 1);
        songIds.splice(toIndex, 0, moved);
        return { ...p, songIds, updatedAt: Date.now() };
      })
    );
  };

  const getPlaylistById = (playlistId) => playlists.find((p) => p.id === playlistId) || null;

  const getPlaylistSongs = (playlistId) => {
    const playlist = getPlaylistById(playlistId);
    return playlist ? getSongsByIds(playlist.songIds) : [];
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        reorderPlaylist,
        setPlaylistCover,
        getPlaylistById,
        getPlaylistSongs,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  const ctx = useContext(PlaylistContext);
  if (!ctx) throw new Error('usePlaylists must be used within PlaylistProvider');
  return ctx;
}
