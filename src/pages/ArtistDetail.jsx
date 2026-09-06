import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSongsByArtist } from '../models/songQueries';
import { getArtistPhoto } from '../data/artistPhotos';
import { usePlayer } from '../context/PlayerContext';
import { SongCard } from '../components/cards/SongCard';
import { AddToPlaylistModal } from '../components/common/AddToPlaylistModal';
import { Button } from '../components/common/Button';
import './DetailPage.css';

export function ArtistDetail() {
  const { name } = useParams();
  const artistName = decodeURIComponent(name);
  const songs = getSongsByArtist(artistName);
  const photo = getArtistPhoto(artistName);
  const { playSong } = usePlayer();
  const [addTarget, setAddTarget] = useState(null);

  const initials = artistName.split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <div>
      <Link to="/library/artists" className="detail-back">‹ Artists</Link>
      <div className="detail-header">
        <div className="detail-avatar" aria-hidden="true">
          {photo ? <img src={photo} alt="" /> : initials}
        </div>
        <div>
          <p className="detail-kicker">Artist</p>
          <h1>{artistName}</h1>
          <p className="detail-meta">{songs.length} songs</p>
          {songs.length > 0 && (
            <Button onClick={() => playSong(songs[0], songs)}>▶ Play All</Button>
          )}
        </div>
      </div>

      <div className="card-grid">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} queue={songs} onAddToPlaylist={setAddTarget} />
        ))}
      </div>

      {addTarget && <AddToPlaylistModal song={addTarget} onClose={() => setAddTarget(null)} />}
    </div>
  );
}
