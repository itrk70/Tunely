import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PlaylistProvider } from './context/PlaylistContext';
import { PlayerProvider } from './context/PlayerContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { PlayerBar } from './components/player/PlayerBar';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Library } from './pages/Library';
import { ArtistDetail } from './pages/ArtistDetail';
import { AlbumDetail } from './pages/AlbumDetail';
import { Playlists } from './pages/Playlists';
import { PlaylistDetail } from './pages/PlaylistDetail';

export default function App() {
  return (
    <ThemeProvider>
      <PlaylistProvider>
        <PlayerProvider>
          <BrowserRouter>
            {/*
              Layout decision: the outer shell is a fixed-height flex COLUMN
              (not `position: fixed` bars floating over content). The
              scrollable row (sidebar + page content) is one flex item;
              the player bar and mobile nav are separate flex items
              stacked below it. This fixes two bugs at once:
              1) mobile browsers were intermittently hiding the old
                 `position: fixed` player bar during scroll/toolbar
                 changes — a flex item in normal document flow can't do
                 that, it's always laid out.
              2) the desktop sidebar used to be `height: 100vh`, so once
                 the player bar (also `position: fixed`) appeared over
                 the bottom of the viewport, it visually covered the
                 sidebar's bottom edge — including the theme toggle.
                 Now the sidebar's height comes from this flex row, which
                 already excludes the player bar's height, so nothing
                 overlaps.
            */}
            <div className="app-shell">
              <div className="app-body">
                <Sidebar />
                <main className="app-main">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/library" element={<Navigate to="/library/songs" replace />} />
                    <Route path="/library/:tab" element={<Library />} />
                    <Route path="/library/artists/:name" element={<ArtistDetail />} />
                    <Route path="/library/albums/:name" element={<AlbumDetail />} />
                    <Route path="/playlists" element={<Playlists />} />
                    <Route path="/playlists/:id" element={<PlaylistDetail />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
              <PlayerBar />
              <MobileNav />
            </div>
          </BrowserRouter>
        </PlayerProvider>
      </PlaylistProvider>
    </ThemeProvider>
  );
}
