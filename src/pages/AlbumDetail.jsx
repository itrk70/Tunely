import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSongsByAlbum } from '../models/songQueries';
import { usePlayer } from '../context/PlayerContext';
import { SongCard } from '../components/cards/SongCard';
import { AddToPlaylistModal } from '../components/common/AddToPlaylistModal';
import { Button } from '../components/common/Button';
import './DetailPage.css';

export function AlbumDetail() {
  const { name } = useParams();
  const albumName = decodeURIComponent(name);
  const songs = getSongsByAlbum(albumName);
  const { playSong } = usePlayer();
  const [addTarget, setAddTarget] = useState(null);

  return (
    <div>
      <Link to="/library/albums" className="detail-back">‹ Albums</Link>
      <div className="detail-header">
        <div className="detail-art">
          {songs[0] && <img src={songs[0].coverImage} alt="" />}
        </div>
        <div>
          <p className="detail-kicker">Album</p>
          <h1>{albumName}</h1>
          <p className="detail-meta">
            {[...new Set(songs.flatMap((s) => s.artists))].join(', ')} · {songs.length} songs
          </p>
          {songs.length > 0 && <Button onClick={() => playSong(songs[0], songs)}>▶ Play Album</Button>}
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
