import { useState } from 'react';
import { usePlaylists } from '../context/PlaylistContext';
import { getSongsByIds } from '../models/songQueries';
import { PlaylistCard } from '../components/cards/PlaylistCard';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { EditCoverModal } from '../components/common/EditCoverModal';
import { TopBar } from '../components/layout/TopBar';
import { useNavigate } from 'react-router-dom';

export function Playlists() {
  const { playlists, createPlaylist } = usePlaylists();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  // Bug fix: "Edit cover" used to be reachable only from inside a
  // playlist's own detail page. This tracks which playlist (if any) is
  // being edited right from the overview grid — PlaylistCard's hover
  // button below calls setEditingPlaylist directly.
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = createPlaylist(name);
    setName('');
    setShowCreate(false);
    navigate(`/playlists/${id}`);
  };

  return (
    <div>
      <TopBar title="My Playlists" />

      <div className="section-head">
        <h2>My Playlists</h2>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          + Create Playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <EmptyState
          icon="☰"
          title="You haven't created any playlists yet."
          message="Create your first playlist to start organizing songs you love."
          action={<Button onClick={() => setShowCreate(true)}>+ Create Playlist</Button>}
        />
      ) : (
        <div className="card-grid">
          {playlists.map((p) => (
            <PlaylistCard
              key={p.id}
              playlist={p}
              songs={getSongsByIds(p.songIds)}
              onEditCover={setEditingPlaylist}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="Create playlist" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Playlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              aria-label="Playlist name"
            />
            <div className="modal-actions">
              <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {editingPlaylist && (
        <EditCoverModal
          playlistId={editingPlaylist.id}
          songs={getSongsByIds(editingPlaylist.songIds)}
          currentCoverSongIds={editingPlaylist.coverSongIds}
          onClose={() => setEditingPlaylist(null)}
        />
      )}
    </div>
  );
}
