import { useState } from 'react';
import { usePlaylists } from '../../context/PlaylistContext';
import { Modal } from './Modal';
import { Button } from './Button';

export function AddToPlaylistModal({ song, onClose }) {
  const { playlists, createPlaylist, addSongToPlaylist } = usePlaylists();
  const [newName, setNewName] = useState('');

  const handleAdd = (playlistId) => {
    addSongToPlaylist(playlistId, song.id);
    onClose();
  };

  const handleCreateAndAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const id = createPlaylist(newName);
    addSongToPlaylist(id, song.id);
    onClose();
  };

  return (
    <Modal title={`Add "${song.name}" to playlist`} onClose={onClose}>
      {playlists.length > 0 ? (
        <ul className="playlist-pick-list">
          {playlists.map((p) => (
            <li key={p.id}>
              <button className="playlist-pick-item" onClick={() => handleAdd(p.id)}>
                <span>{p.name}</span>
                <span className="playlist-pick-count">{p.songIds.length} songs</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-4)' }}>
          You don't have any playlists yet — create one below.
        </p>
      )}
      <form onSubmit={handleCreateAndAdd}>
        <input
          type="text"
          placeholder="New playlist name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          aria-label="New playlist name"
        />
        <div className="modal-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create &amp; add
          </Button>
        </div>
      </form>
    </Modal>
  );
}
