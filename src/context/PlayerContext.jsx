import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PlayerContext = createContext(null);

const RESTART_THRESHOLD_SECONDS = 3;
const RECENTLY_PLAYED_LIMIT = 20;

/*
  Decision: one central playback state (currentSong, queue, currentIndex,
  isPlaying, shuffle, repeat) lives here, not inside individual pages
  (§21). Any page can start playback by calling playSong(song, queue) —
  e.g. "play this album" passes that album's song list as the queue, so
  Next/Previous and auto-advance always follow the right context (§22).
*/
export function PlayerProvider({ children }) {
  const player = useAudioPlayer();
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false); // repeat current queue when it ends

  /*
    Feature: real listen history for "Recently Played" (previously Home
    just showed the first 5 library songs regardless of what anyone had
    actually played). This stores song IDs only — never full song
    objects — same source-of-truth principle as playlists (§8): Home
    resolves these against the music library when it renders.
    Most-recent-first, deduped (replaying a song moves it back to the
    front instead of creating a second entry), capped at 20 so this
    can't grow forever.
  */
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useLocalStorage('tunely:recentlyPlayed', []);

  const recordRecentlyPlayed = (songId) => {
    setRecentlyPlayedIds((prev) => [songId, ...prev.filter((id) => id !== songId)].slice(0, RECENTLY_PLAYED_LIMIT));
  };

  const queueRef = useRef(queue);
  const indexRef = useRef(currentIndex);
  queueRef.current = queue;
  indexRef.current = currentIndex;

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;

  // Every place that actually starts a new track (manual play, skip,
  // auto-advance) goes through this so listen history is recorded
  // consistently instead of only when playSong() is called directly.
  const startPlayback = (song) => {
    recordRecentlyPlayed(song.id);
    player.loadAndPlay(song);
  };

  const playSong = (song, contextQueue = [song]) => {
    const idx = contextQueue.findIndex((s) => s.id === song.id);
    setQueue(contextQueue);
    setCurrentIndex(idx === -1 ? 0 : idx);
    startPlayback(song);
  };

  const togglePlayPause = () => {
    if (!currentSong) return;
    player.isPlaying ? player.pause() : player.play();
  };

  const goToIndex = (idx, list = queueRef.current) => {
    if (idx < 0 || idx >= list.length) {
      if (repeat && list.length > 0) {
        setCurrentIndex(0);
        startPlayback(list[0]);
      }
      return;
    }
    setCurrentIndex(idx);
    startPlayback(list[idx]);
  };

  const next = () => {
    const list = queueRef.current;
    if (list.length === 0) return;
    if (shuffle) {
      const idx = Math.floor(Math.random() * list.length);
      goToIndex(idx, list);
      return;
    }
    goToIndex(indexRef.current + 1, list);
  };

  const previous = () => {
    // §23: restart current song if it's played more than a few seconds in,
    // otherwise jump back to the previous track.
    if (player.currentTime > RESTART_THRESHOLD_SECONDS) {
      player.seek(0);
      return;
    }
    goToIndex(indexRef.current - 1, queueRef.current);
  };

  /*
    Feature: "Add to Queue" (from a song card's hover button) and the
    Queue drawer's drag-to-reorder. `upNext` is everything after the
    currently playing track — that's the part a person can actually see
    and reorder in the drawer; the played history before currentIndex
    is left alone.
  */
  const upNext = currentIndex >= 0 ? queue.slice(currentIndex + 1) : queue;

  const addToQueue = (song) => {
    if (!currentSong) {
      // Nothing playing yet — "add to queue" only makes sense once
      // there's a queue, so just start playing this song instead.
      playSong(song, [song]);
      return;
    }
    setQueue((prev) => [...prev, song]);
  };

  // fromIndex/toIndex are positions WITHIN upNext (i.e. 0 = the very next
  // song), not raw queue indices — the drawer only ever reorders the
  // upcoming portion, never the currently-playing song or history.
  const reorderQueue = (fromIndex, toIndex) => {
    setQueue((prev) => {
      const boundary = indexRef.current + 1;
      const before = prev.slice(0, boundary);
      const after = prev.slice(boundary);
      if (fromIndex < 0 || fromIndex >= after.length || toIndex < 0 || toIndex >= after.length) return prev;
      const reordered = [...after];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);
      return [...before, ...reordered];
    });
  };

  // Auto-advance when a track ends (§22).
  useEffect(() => player.onEnded(() => next()), [shuffle, repeat]); // eslint-disable-line react-hooks/exhaustive-deps

  /*
    Feature: Media Session API — this is what actually gives "system
    button" control. A browser can't hand JavaScript control of the
    hardware volume buttons — those already control the OS/device
    output level directly and work automatically, independent of any
    web page. What Tunely CAN hook into is play/pause/next/previous
    coming from a laptop's media keys, a phone's lock screen, a
    bluetooth headset, or a smartwatch — that's the Media Session API.
    Registering it here means those system-level controls now drive the
    same playback state as the on-screen buttons.
  */
  const actionsRef = useRef({});
  actionsRef.current = { togglePlayPause, next, previous, seek: player.seek };

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play', () => actionsRef.current.togglePlayPause());
    navigator.mediaSession.setActionHandler('pause', () => actionsRef.current.togglePlayPause());
    navigator.mediaSession.setActionHandler('previoustrack', () => actionsRef.current.previous());
    navigator.mediaSession.setActionHandler('nexttrack', () => actionsRef.current.next());
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime != null) actionsRef.current.seek(details.seekTime);
    });
    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('seekto', null);
    };
  }, []); // registered once — actionsRef always points at the latest functions

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.name,
      artist: currentSong.artists.join(', '),
      album: currentSong.album || 'Tunely',
      artwork: currentSong.coverImage ? [{ src: currentSong.coverImage, sizes: '512x512', type: 'image/jpeg' }] : [],
    });
  }, [currentSong]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = player.isPlaying ? 'playing' : 'paused';
  }, [player.isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        currentIndex,
        upNext,
        recentlyPlayedIds,
        isPlaying: player.isPlaying,
        currentTime: player.currentTime,
        duration: player.duration,
        volume: player.volume,
        error: player.error,
        shuffle,
        repeat,
        playSong,
        togglePlayPause,
        next,
        previous,
        addToQueue,
        reorderQueue,
        seek: player.seek,
        setVolume: player.setVolume,
        toggleShuffle: () => setShuffle((s) => !s),
        toggleRepeat: () => setRepeat((r) => !r),
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
