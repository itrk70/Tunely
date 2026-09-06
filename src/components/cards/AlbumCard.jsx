import { Link } from 'react-router-dom';
import './Card.css';

export function AlbumCard({ album }) {
  return (
    <Link to={`/library/albums/${encodeURIComponent(album.name)}`} className="card">
      <div className="card-art">
        <img src={album.coverImage} alt="" loading="lazy" />
      </div>
      <p className="card-title">{album.name}</p>
      <p className="card-subtitle">{album.songCount} songs</p>
    </Link>
  );
}
