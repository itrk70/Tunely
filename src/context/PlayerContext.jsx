import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const PlayerContext = createContext(null);

const RESTART_THRESHOLD_SECONDS = 3;

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

  const queueRef = useRef(queue);
  const indexRef = useRef(currentIndex);
  queueRef.current = queue;
  indexRef.current = currentIndex;

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;

  const playSong = (song, contextQueue = [song]) => {
    const idx = contextQueue.findIndex((s) => s.id === song.id);
    setQueue(contextQueue);
    setCurrentIndex(idx === -1 ? 0 : idx);
    player.loadAndPlay(song);
  };

  const togglePlayPause = () => {
    if (!currentSong) return;
    player.isPlaying ? player.pause() : player.play();
  };

  const goToIndex = (idx, list = queueRef.current) => {
    if (idx < 0 || idx >= list.length) {
      if (repeat && list.length > 0) {
        setCurrentIndex(0);
        player.loadAndPlay(list[0]);
      }
      return;
    }
    setCurrentIndex(idx);
    player.loadAndPlay(list[idx]);
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

  // Auto-advance when a track ends (§22).
  useEffect(() => player.onEnded(() => next()), [shuffle, repeat]); // eslint-disable-line react-hooks/exhaustive-deps

  /*
    Feature: Media Session API — this is what actually gives "system
    button" control (user request #1). A browser can't hand JavaScript
    control of the hardware volume buttons — those already control the
    OS/device output level directly and work automatically, independent
    of any web page. What Tunely CAN hook into is play/pause/next/
    previous coming from a laptop's media keys, a phone's lock screen,
    a bluetooth headset, or a smartwatch — that's the Media Session API.
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
