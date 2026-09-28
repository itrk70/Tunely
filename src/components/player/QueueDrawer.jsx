import { useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { DragHandleIcon } from './PlayerIcons';
import './QueueDrawer.css';

/*
  Feature: Queue management drawer (user request). Slides in from the
  right instead of the centered Modal used elsewhere — a queue is a
  strip of upcoming songs, which reads better as a side panel than a
  centered dialog. Shares the same accessibility pattern as Modal
  (Escape closes, backdrop click closes) but with its own slide
  transition, so it isn't just Modal with different CSS.
*/
export function QueueDrawer({ open, onClose }) {
  const { currentSong, upNext, reorderQueue } = usePlayer();
  const dragIndex = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const moveSong = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= upNext.length) return;
    reorderQueue(fromIndex, toIndex);
  };

  return (
    <div className={`queue-drawer-overlay ${open ? 'queue-drawer-overlay-open' : ''}`} onMouseDown={onClose}>
      <aside
        className={`queue-drawer ${open ? 'queue-drawer-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Playback queue"
        ref={panelRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="queue-drawer-head">
          <h3>Queue</h3>
          <button className="queue-drawer-close" onClick={onClose} aria-label="Close queue">
            ✕
          </button>
        </div>

        <div className="queue-drawer-body">
          <p className="queue-section-label">Now Playing</p>
          {currentSong ? (
            <div className="queue-row queue-row-current">
              <img src={currentSong.coverImage} alt="" />
              <span>
                <span className="queue-row-name">{currentSong.name}</span>
                <span className="queue-row-artist">{currentSong.artists.join(', ')}</span>
              </span>
            </div>
          ) : (
            <p className="queue-empty-hint">Nothing is playing right now.</p>
          )}

          <p className="queue-section-label queue-section-label-spaced">Up Next</p>
          {upNext.length === 0 ? (
            <p className="queue-empty-hint">No songs queued next — use "Add to queue" on any song.</p>
          ) : (
            <ul className="queue-list">
              {upNext.map((song, index) => (
                <li
                  key={`${song.id}-${index}`}
                  className="queue-row"
                  draggable
                  onDragStart={() => (dragIndex.current = index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    moveSong(dragIndex.current, index);
                    dragIndex.current = null;
                  }}
                >
                  <span className="queue-drag-handle" aria-hidden="true">
                    <DragHandleIcon width={16} height={16} />
                  </span>
                  <img src={song.coverImage} alt="" />
                  <span>
                    <span className="queue-row-name">{song.name}</span>
                    <span className="queue-row-artist">{song.artists.join(', ')}</span>
                  </span>
                  <div className="queue-row-reorder">
                    <button
                      aria-label={`Move ${song.name} up in queue`}
                      onClick={() => moveSong(index, index - 1)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      aria-label={`Move ${song.name} down in queue`}
                      onClick={() => moveSong(index, index + 1)}
                      disabled={index === upNext.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
