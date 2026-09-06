import { useRef, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';
import {
  PlayIcon,
  PauseIcon,
  PreviousIcon,
  NextIcon,
  ShuffleIcon,
  RepeatIcon,
  VolumeIcon,
  MuteIcon,
} from './PlayerIcons';
import './PlayerBar.css';

export function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlayPause,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    error,
  } = usePlayer();

  // Remembers the volume level from before a mute, so clicking the
  // speaker icon again restores it instead of just jumping to 100%.
  const lastVolumeRef = useRef(volume || 0.8);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!currentSong) return null;

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  const toggleMute = () => {
    if (volume > 0) {
      lastVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(lastVolumeRef.current || 0.8);
    }
  };

  return (
    <div className="player-bar">
      <div className="player-bar-inner">
        <div className="player-track-info">
          <img src={currentSong.coverImage} alt="" className="player-cover" />
          <div className="player-track-text">
            <p className="player-track-name">{currentSong.name}</p>
            <p className="player-track-artist">{currentSong.artists.join(', ')}</p>
          </div>
        </div>

        <div className="player-controls">
          <div className="player-buttons">
            <button
              className={`player-icon-btn ${shuffle ? 'player-icon-active' : ''}`}
              onClick={toggleShuffle}
              aria-label="Toggle shuffle"
              aria-pressed={shuffle}
              data-tooltip="Shuffle"
            >
              <ShuffleIcon />
            </button>
            <button className="player-icon-btn" onClick={previous} aria-label="Previous track" data-tooltip="Previous">
              <PreviousIcon />
            </button>
            <button
              className="player-play-btn"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              data-tooltip={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <PauseIcon width={16} height={16} /> : <PlayIcon width={16} height={16} />}
            </button>
            <button className="player-icon-btn" onClick={next} aria-label="Next track" data-tooltip="Next">
              <NextIcon />
            </button>
            <button
              className={`player-icon-btn ${repeat ? 'player-icon-active' : ''}`}
              onClick={toggleRepeat}
              aria-label="Toggle repeat"
              aria-pressed={repeat}
              data-tooltip="Repeat"
            >
              <RepeatIcon />
            </button>
          </div>

          <div className="player-progress-row">
            <span className="player-time">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="player-seek"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              style={{ '--progress': `${progressPct}%` }}
            />
            <span className="player-time">{formatTime(duration)}</span>
          </div>
        </div>

        <div
          className="player-volume"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            className="player-icon-btn"
            onClick={toggleMute}
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            data-tooltip={volume === 0 ? 'Unmute' : 'Mute'}
          >
            {volume === 0 ? <MuteIcon /> : <VolumeIcon />}
          </button>
          <input
            type="range"
            className={`player-volume-slider ${showVolumeSlider ? 'player-volume-slider-visible' : ''}`}
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>
      </div>
      {error && (
        <p className="player-error" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
