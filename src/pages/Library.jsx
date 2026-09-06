import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { getAllSongs, getAllArtists, getAllAlbums } from '../models/songQueries';
import { SongCard } from '../components/cards/SongCard';
import { ArtistCard } from '../components/cards/ArtistCard';
import { AlbumCard } from '../components/cards/AlbumCard';
import { AddToPlaylistModal } from '../components/common/AddToPlaylistModal';
import { TopBar } from '../components/layout/TopBar';
import './Library.css';

const TABS = [
  { key: 'songs', label: 'Songs', to: '/library/songs' },
  { key: 'artists', label: 'Artists', to: '/library/artists' },
  { key: 'albums', label: 'Albums', to: '/library/albums' },
];

export function Library() {
  const { tab = 'songs' } = useParams();
  const [addTarget, setAddTarget] = useState(null);
  const songs = getAllSongs();

  return (
    <div>
      <TopBar title="Library" />

      <div className="library-tabs">
        {TABS.map((t) => (
          <NavLink key={t.key} to={t.to} className={({ isActive }) => `library-tab ${isActive ? 'library-tab-active' : ''}`}>
            {t.label}
          </NavLink>
        ))}
      </div>

      {tab === 'songs' && (
        <div className="card-grid">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} queue={songs} onAddToPlaylist={setAddTarget} />
          ))}
        </div>
      )}

      {tab === 'artists' && (
        <div className="card-grid">
          {getAllArtists().map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}

      {tab === 'albums' && (
        <div className="card-grid">
          {getAllAlbums().map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}

      {addTarget && <AddToPlaylistModal song={addTarget} onClose={() => setAddTarget(null)} />}
    </div>
  );
}
