import { Link } from 'react-router-dom';
import './Card.css';

export function PlaylistCard({ playlist, coverImage }) {
  return (
    <Link to={`/playlists/${playlist.id}`} className="card">
      <div className="card-art">
        {coverImage ? (
          <img src={coverImage} alt="" loading="lazy" />
        ) : (
          <div className="avatar-fallback" aria-hidden="true">♪</div>
        )}
      </div>
      <p className="card-title">{playlist.name}</p>
      <p className="card-subtitle">{playlist.songIds.length} songs</p>
    </Link>
  );
}
