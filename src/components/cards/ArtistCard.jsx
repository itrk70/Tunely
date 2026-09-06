import { Link } from 'react-router-dom';
import './Card.css';

export function ArtistCard({ artist }) {
  const initials = artist.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <Link to={`/library/artists/${encodeURIComponent(artist.name)}`} className="card artist-card">
      <div className="card-art" aria-hidden="true">
        {artist.photo ? (
          <img src={artist.photo} alt="" loading="lazy" />
        ) : (
          <div className="avatar-fallback">{initials}</div>
        )}
      </div>
      <p className="card-title">{artist.name}</p>
      <p className="card-subtitle">{artist.songCount} songs</p>
    </Link>
  );
}
