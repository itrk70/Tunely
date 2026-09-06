import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { search, getAllTags } from '../models/songQueries';
import { SongCard } from '../components/cards/SongCard';
import { ArtistCard } from '../components/cards/ArtistCard';
import { AlbumCard } from '../components/cards/AlbumCard';
import { SearchBar } from '../components/search/SearchBar';
import { Tag } from '../components/common/Tag';
import { EmptyState } from '../components/common/EmptyState';
import { AddToPlaylistModal } from '../components/common/AddToPlaylistModal';
import { TopBar } from '../components/layout/TopBar';

export function Search() {
  const [query, setQuery] = useState('');
  const [addTarget, setAddTarget] = useState(null);
  const tags = useMemo(() => getAllTags(), []);
  const results = useMemo(() => search(query), [query]);

  const hasQuery = query.trim().length > 0;
  const hasResults = results.songs.length + results.artists.length + results.albums.length > 0;

  return (
    <div>
      <TopBar title="Search" />
      <div className="section">
        <SearchBar value={query} onChange={setQuery} autoFocus />
      </div>

      {!hasQuery && (
        <div className="section">
          <div className="section-head">
            <h2>Browse Categories</h2>
          </div>
          <div className="chip-row" style={{ flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {tags.map((tag) => (
              <Tag key={tag} label={tag} onClick={() => setQuery(tag)} />
            ))}
          </div>
        </div>
      )}

      {hasQuery && !hasResults && (
        <EmptyState
          icon="⌕"
          title="No results found"
          message="Try a different song, artist, album, or tag."
        />
      )}

      {hasQuery && results.songs.length > 0 && (
        <div className="section">
          <div className="section-head">
            <h2>Songs</h2>
          </div>
          <div className="card-grid">
            {results.songs.map((song) => (
              <SongCard key={song.id} song={song} queue={results.songs} onAddToPlaylist={setAddTarget} />
            ))}
          </div>
        </div>
      )}

      {hasQuery && results.artists.length > 0 && (
        <div className="section">
          <div className="section-head">
            <h2>Artists</h2>
          </div>
          <div className="card-row">
            {results.artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      )}

      {hasQuery && results.albums.length > 0 && (
        <div className="section">
          <div className="section-head">
            <h2>Albums</h2>
          </div>
          <div className="card-row">
            {results.albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      )}

      {addTarget && <AddToPlaylistModal song={addTarget} onClose={() => setAddTarget(null)} />}
    </div>
  );
}
