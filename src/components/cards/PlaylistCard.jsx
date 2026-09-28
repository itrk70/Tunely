import { Link } from 'react-router-dom';
import { PlaylistCoverArt, resolveCoverSongs } from './PlaylistCoverArt';
import './Card.css';

const MIN_SONGS_FOR_CUSTOM_COVER = 4;

/*
  Bug fix: "Edit cover" used to only exist on the playlist DETAIL page —
  a user had to open a playlist just to change how it looks from the
  overview grid. `onEditCover` is optional so this card still works
  anywhere it's used without a picker wired up; when it IS provided
  (from the Playlists overview page), a hover button appears directly
  on the card, matching the same eligibility rule (4+ songs) as the
  detail page.
*/
export function PlaylistCard({ playlist, songs, onEditCover }) {
  const songList = songs || [];
  const coverSongs = resolveCoverSongs(playlist, songList);
  const canCustomizeCover = songList.length >= MIN_SONGS_FOR_CUSTOM_COVER;

  return (
    <div className="card">
      <Link to={`/playlists/${playlist.id}`} className="card-link-wrap">
        <div className="card-art">
          <PlaylistCoverArt songs={coverSongs} />
        </div>
      </Link>
      {onEditCover && canCustomizeCover && (
        <button
          className="card-edit-cover-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEditCover(playlist);
          }}
          aria-label={`Edit cover for ${playlist.name}`}
          data-tooltip="Edit cover"
        >
          ✎
        </button>
      )}
      <Link to={`/playlists/${playlist.id}`} className="card-text-link">
        <p className="card-title">{playlist.name}</p>
        <p className="card-subtitle">{playlist.songIds.length} songs</p>
      </Link>
    </div>
  );
}
