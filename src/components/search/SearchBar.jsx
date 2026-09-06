import './SearchBar.css';

export function SearchBar({ value, onChange, autoFocus, placeholder = 'Search songs, artists, albums…' }) {
  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search"
      />
    </div>
  );
}
