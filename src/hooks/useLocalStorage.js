import { useEffect, useState } from 'react';

/*
  Decision: one small wrapper hook around localStorage, used by both
  PlaylistContext and ThemeContext. Reading is defensive — corrupted or
  missing data falls back to `defaultValue` instead of throwing (§39),
  so a bad localStorage entry can never crash the whole app.
*/
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable (e.g. private browsing) — fail silently,
      // the app keeps working in-memory for the session.
    }
  }, [key, value]);

  return [value, setValue];
}
