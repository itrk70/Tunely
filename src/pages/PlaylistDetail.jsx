import { useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { usePlaylists } from '../context/PlaylistContext';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/formatTime';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { EditCoverModal } from '../components/common/EditCoverModal';
import { PlaylistCoverArt, resolveCoverSongs } from '../components/cards/PlaylistCoverArt';
import './PlaylistDetail.css';
import './DetailPage.css';

const MIN_SONGS_FOR_CUSTOM_COVER = 4;

export function PlaylistDetail() {
  const { id } = useParams();
  const { getPlaylistById, getPlaylistSongs, renamePlaylist, deletePlaylist, removeSongFromPlaylist, reorderPlaylist } =
    usePlaylists();
  const { playSong, currentSong, isPlaying } = usePlayer();

  const playlist = getPlaylistById(id);
  const [showRename, setShowRename] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditCover, setShowEditCover] = useState(false);
  const [renameValue, setRenameValue] = useState(playlist?.name || '');
  const dragIndex = useRef(null);

  if (!playlist) {
    // Deleted/nonexistent playlist (§39) — send back to the list instead of crashing.
    return <Navigate to="/playlists" replace />;
  }

  const songs = getPlaylistSongs(id);
  const totalSeconds = songs.reduce((sum, s) => sum + (s.duration || 0), 0);
  const coverSongs = resolveCoverSongs(playlist, songs);
  const canCustomizeCover = songs.length >= MIN_SONGS_FOR_CUSTOM_COVER;

  const handleRename = (e) => {
    e.preventDefault();
    if (renameValue.trim()) renamePlaylist(id, renameValue);
    setShowRename(false);
  };

  const handleDelete = () => {
    deletePlaylist(id);
  };

  const moveSong = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= songs.length) return;
    reorderPlaylist(id, fromIndex, toIndex);
  };

  return (
    <div>
      <Link to="/playlists" className="detail-back">‹ My Playlists</Link>

      <div className="detail-header">
        <div className="detail-art playlist-detail-art">
          <PlaylistCoverArt songs={coverSongs} size="lg" />
          {canCustomizeCover && (
            <button
              className="playlist-cover-edit-btn"
              onClick={() => setShowEditCover(true)}
              aria-label="Edit playlist cover"
              data-tooltip="Edit cover"
            >
              ✎
            </button>
          )}
        </div>
        <div>
          <p className="detail-kicker">Playlist</p>
          <h1>{playlist.name}</h1>
          <p className="detail-meta">
            {songs.length} songs{totalSeconds > 0 ? ` · ${Math.round(totalSeconds / 60)} min` : ''}
          </p>
          <div className="chip-row">
            {songs.length > 0 && <Button onClick={() => playSong(songs[0], songs)}>▶ Play</Button>}
            <Button variant="secondary" size="sm" onClick={() => setShowRename(true)}>
              Rename
            </Button>
            {canCustomizeCover && (
              <Button variant="secondary" size="sm" onClick={() => setShowEditCover(true)}>
                Edit cover
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {songs.length === 0 ? (
        <EmptyState
          icon="♪"
          title="Your playlist is empty."
          message="Find some music to get started — add songs from Search, Library, or any album."
          action={
            <Link to="/search">
              <Button>Find music</Button>
            </Link>
          }
        />
      ) : (
        <ul className="playlist-song-list">
          {songs.map((song, index) => {
            const isActive = currentSong?.id === song.id;
            return (
              <li
                key={song.id}
                className={`playlist-song-row ${isActive ? 'playlist-song-row-active' : ''}`}
                draggable
                onDragStart={() => (dragIndex.current = index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  moveSong(dragIndex.current, index);
                  dragIndex.current = null;
                }}
              >
                <span className="playlist-song-index">{isActive && isPlaying ? '♪' : index + 1}</span>
                <button className="playlist-song-main" onClick={() => playSong(song, songs)}>
                  <img src={song.coverImage} alt="" />
                  <span>
                    <span className="playlist-song-name">{song.name}</span>
                    <span className="playlist-song-artist">{song.artists.join(', ')}</span>
                  </span>
                </button>
                <span className="playlist-song-duration">{formatTime(song.duration)}</span>

                <div className="playlist-song-reorder">
                  <button
                    aria-label={`Move ${song.name} up`}
                    onClick={() => moveSong(index, index - 1)}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    aria-label={`Move ${song.name} down`}
                    onClick={() => moveSong(index, index + 1)}
                    disabled={index === songs.length - 1}
                  >
                    ↓
                  </button>
                </div>

                <button
                  className="playlist-song-remove"
                  onClick={() => removeSongFromPlaylist(id, song.id)}
                  aria-label={`Remove ${song.name} from playlist`}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showRename && (
        <Modal title="Rename playlist" onClose={() => setShowRename(false)}>
          <form onSubmit={handleRename}>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              autoFocus
              aria-label="Playlist name"
            />
            <div className="modal-actions">
              <Button variant="secondary" type="button" onClick={() => setShowRename(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {showEditCover && (
        <EditCoverModal
          playlistId={id}
          songs={songs}
          currentCoverSongIds={playlist.coverSongIds}
          onClose={() => setShowEditCover(false)}
        />
      )}

      {showDeleteConfirm && (
        <Modal title={`Delete "${playlist.name}"?`} onClose={() => setShowDeleteConfirm(false)}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
            This only removes the playlist. The songs stay in your library.
          </p>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete playlist
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
