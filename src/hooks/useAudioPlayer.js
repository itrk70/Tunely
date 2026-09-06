import { useEffect, useRef, useState } from 'react';

/*
  Decision: exactly one <audio> element for the whole app, created once
  here and driven imperatively. All player UI reads its state from this
  hook rather than touching the DOM directly (§33 — keep browser APIs in
  one place, not scattered through components).
*/
export function useAudioPlayer() {
  const audioRef = useRef(null);
  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [error, setError] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      // Missing/broken audio source (§24) — surface it without throwing.
      setError('This track is unavailable right now.');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const loadAndPlay = (song) => {
    const audio = audioRef.current;
    if (!audio || !song) return;
    setError(null);
    if (!song.audioSrc) {
      setError('No audio available for this track.');
      return;
    }
    audio.src = song.audioSrc;
    audio.currentTime = 0;
    audio.play().catch(() => setError('Playback was blocked or failed.'));
  };

  const play = () => audioRef.current?.play().catch(() => setError('Playback was blocked or failed.'));
  const pause = () => audioRef.current?.pause();
  const seek = (time) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  };
  const setVolume = (v) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const onEnded = (callback) => {
    const audio = audioRef.current;
    if (!audio) return () => {};
    audio.addEventListener('ended', callback);
    return () => audio.removeEventListener('ended', callback);
  };

  return { isPlaying, currentTime, duration, volume, error, loadAndPlay, play, pause, seek, setVolume, onEnded };
}
