import { useMemo, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { getAllSongs, getAllArtists, getAllAlbums } from '../models/songQueries';
import { SongCard } from '../components/cards/SongCard';
import { ArtistCard } from '../components/cards/ArtistCard';
import { AlbumCard } from '../components/cards/AlbumCard';
import { AddToPlaylistModal } from '../components/common/AddToPlaylistModal';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/common/Button';
import './Home.css';

export function Home() {
  const { playSong } = usePlayer();
  const [addTarget, setAddTarget] = useState(null);

  const allSongs = getAllSongs();
  // Home shows curated slices, never the whole library (§16).
  const recentlyPlayed = useMemo(() => allSongs.slice(0, 5), [allSongs]);
  const featuredSongs = useMemo(() => [...allSongs].reverse().slice(0, 5), [allSongs]);
  const featuredArtists = useMemo(() => getAllArtists().slice(0, 5), []);
  const featuredAlbums = useMemo(() => getAllAlbums().slice(0, 5), []);
  const artistCount = useMemo(() => getAllArtists().length, []);

  const heroSong = allSongs[0];

  return (
    <div>
      <TopBar title="Home" />

      <section className="hero-banner">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-eyebrow">✦ Curated for you</span>
            <h2>Focus. Relax. Enjoy.</h2>
            <p>Music for every moment, pulled from your curated library.</p>
            <div className="hero-actions">
              <Button onClick={() => playSong(heroSong, allSongs)}>▶ Play Now</Button>
              <span className="hero-stat">
                {allSongs.length} songs · {artistCount} artists
              </span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="eq-bars">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </section>

      <div className="section">
        <div className="section-head">
          <h2>Recently Played</h2>
        </div>
        <div className="card-row">
          {recentlyPlayed.map((song) => (
            <SongCard key={song.id} song={song} queue={recentlyPlayed} onAddToPlaylist={setAddTarget} />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Featured Songs</h2>
        </div>
        <div className="card-row">
          {featuredSongs.map((song) => (
            <SongCard key={song.id} song={song} queue={featuredSongs} onAddToPlaylist={setAddTarget} />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Featured Artists</h2>
        </div>
        <div className="card-row">
          {featuredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Featured Albums</h2>
        </div>
        <div className="card-row">
          {featuredAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>

      {addTarget && <AddToPlaylistModal song={addTarget} onClose={() => setAddTarget(null)} />}
    </div>
  );
}
