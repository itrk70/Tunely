import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '⌂', end: true },
  { to: '/search', label: 'Search', icon: '⌕' },
  { to: '/library/songs', label: 'Library', icon: '▤' },
  { to: '/playlists', label: 'Playlists', icon: '☰' },
];

const LIBRARY_SUBLINKS = [
  { to: '/library/songs', label: 'Songs' },
  { to: '/library/artists', label: 'Artists' },
  { to: '/library/albums', label: 'Albums' },
];

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      {/*
        Bug fix: the theme toggle used to live in a footer pinned to the
        sidebar's bottom edge, with the sidebar set to `height: 100vh`.
        Once the player bar appeared (also fixed-position back then), it
        visually sat on top of that bottom edge, covering the toggle —
        it looked "locked" until a refresh happened to change the
        layout. Moving it up into the header avoids the problem
        entirely, and the height fix in Sidebar.css means it can't
        happen again even if something else grows at the bottom.
      */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-mark" aria-hidden="true">♫</span>
        <div className="sidebar-logo-text">
          <p className="sidebar-logo-title">Tunely</p>
          <p className="sidebar-logo-tag">Feel the music</p>
        </div>
        <button
          className="sidebar-theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle light and dark theme"
          data-tooltip={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <div key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
            {item.label === 'Library' && (
              <div className="sidebar-sublinks">
                {LIBRARY_SUBLINKS.map((sub) => (
                  <NavLink
                    key={sub.to}
                    to={sub.to}
                    className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink-active' : ''}`}
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
