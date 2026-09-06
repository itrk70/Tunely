import { usePlayer } from '../../context/PlayerContext';
import './Card.css';

export function SongCard({ song, queue, onAddToPlaylist }) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?.id === song.id;

  return (
    <div className={`card song-card ${isActive ? 'card-active' : ''}`}>
      <div className="card-art">
        <img src={song.coverImage} alt="" loading="lazy" />
        <button
          className="card-play-btn"
          onClick={() => playSong(song, queue || [song])}
          aria-label={isActive && isPlaying ? `Pause ${song.name}` : `Play ${song.name}`}
        >
          {isActive && isPlaying ? '❚❚' : '▶'}
        </button>
        {onAddToPlaylist && (
          <button className="card-add-btn" onClick={() => onAddToPlaylist(song)} aria-label={`Add ${song.name} to playlist`}>
            +
          </button>
        )}
      </div>
      <p className="card-title">{song.name}</p>
      <p className="card-subtitle">{song.artists.join(', ')}</p>
    </div>
  );
}
