import { useState } from 'react';
import { usePlaylists } from '../../context/PlaylistContext';
import { Modal } from './Modal';
import { Button } from './Button';
import './EditCoverModal.css';

const REQUIRED_COUNT = 4;

export function EditCoverModal({ playlistId, songs, currentCoverSongIds, onClose }) {
  const { setPlaylistCover } = usePlaylists();
  const [selected, setSelected] = useState(
    currentCoverSongIds && currentCoverSongIds.length === REQUIRED_COUNT ? currentCoverSongIds : songs.slice(0, 4).map((s) => s.id)
  );

  const toggle = (songId) => {
    setSelected((prev) => {
      if (prev.includes(songId)) return prev.filter((id) => id !== songId);
      if (prev.length >= REQUIRED_COUNT) return prev; // cap at 4
      return [...prev, songId];
    });
  };

  const handleSave = () => {
    if (selected.length !== REQUIRED_COUNT) return;
    setPlaylistCover(playlistId, selected);
    onClose();
  };

  const handleUseDefault = () => {
    setPlaylistCover(playlistId, []);
    onClose();
  };

  return (
    <Modal title="Choose cover songs" onClose={onClose}>
      <p className="edit-cover-hint">
        Pick exactly {REQUIRED_COUNT} songs from this playlist — they'll form a 2×2 cover collage. Selected:{' '}
        {selected.length}/{REQUIRED_COUNT}
      </p>

      <ul className="edit-cover-list">
        {songs.map((song) => {
          const isChecked = selected.includes(song.id);
          const isDisabled = !isChecked && selected.length >= REQUIRED_COUNT;
          return (
            <li key={song.id}>
              <label className={`edit-cover-item ${isDisabled ? 'edit-cover-item-disabled' : ''}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => toggle(song.id)}
                />
                <img src={song.coverImage} alt="" />
                <span>
                  <span className="edit-cover-name">{song.name}</span>
                  <span className="edit-cover-artist">{song.artists.join(', ')}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="modal-actions">
        <Button variant="secondary" onClick={handleUseDefault}>
          Use default
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={selected.length !== REQUIRED_COUNT}>
          Save cover
        </Button>
      </div>
    </Modal>
  );
}
