import { useEffect, useRef } from 'react';
import './Modal.css';

export function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null);

  // Bug fix: focusing the panel must only happen ONCE, on mount. It was
  // previously inside the same effect as the Escape-key listener, which
  // depends on `onClose` — a new function reference on every parent
  // re-render (e.g. every keystroke while typing a playlist name). That
  // re-ran this effect and called .focus() again, yanking focus away
  // from whatever input the user was typing into. Splitting the two
  // concerns into separate effects fixes it: initial focus runs once,
  // the Escape listener can still update freely without stealing focus.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
