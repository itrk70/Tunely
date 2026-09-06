import { NavLink } from 'react-router-dom';
import './MobileNav.css';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '⌂', end: true },
  { to: '/search', label: 'Search', icon: '⌕' },
  { to: '/library/songs', label: 'Library', icon: '▤' },
  { to: '/playlists', label: 'Playlists', icon: '☰' },
];

export function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
