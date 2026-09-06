import { useTheme } from '../../context/ThemeContext';
import './TopBar.css';

export function TopBar({ title }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="top-bar">
      <h1>{title}</h1>
      <button className="top-bar-theme-btn" onClick={toggleTheme} aria-label="Toggle light and dark theme">
        {theme === 'dark' ? '☀' : '☾'}
      </button>
    </header>
  );
}
