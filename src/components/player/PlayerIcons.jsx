/*
  These replace the unicode glyphs (⏮ ⏭ ⟲ ⇄ etc.) that were used before.
  On some phones/browsers those characters don't have a matching font
  glyph installed and render as a blank "unknown character" box — which
  is very likely what looked like "buttons not working" (§ user report
  #3). Plain inline SVG renders identically everywhere.
*/
const common = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function PlayIcon(props) {
  return (
    <svg {...common} {...props}>
      <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PauseIcon(props) {
  return (
    <svg {...common} {...props}>
      <rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none" />
      <rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PreviousIcon(props) {
  return (
    <svg {...common} {...props}>
      <polygon points="19 20 9 12 19 4 19 20" fill="currentColor" stroke="none" />
      <line x1="5" y1="4" x2="5" y2="20" />
    </svg>
  );
}

export function NextIcon(props) {
  return (
    <svg {...common} {...props}>
      <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" stroke="none" />
      <line x1="19" y1="4" x2="19" y2="20" />
    </svg>
  );
}

export function ShuffleIcon(props) {
  return (
    <svg {...common} {...props}>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

export function RepeatIcon(props) {
  return (
    <svg {...common} {...props}>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function VolumeIcon(props) {
  return (
    <svg {...common} {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18 6a9 9 0 0 1 0 12" />
    </svg>
  );
}

export function MuteIcon(props) {
  return (
    <svg {...common} {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

/* Queue toggle button in the player bar (a simple stacked-lines "list" glyph). */
export function QueueIcon(props) {
  return (
    <svg {...common} {...props}>
      <line x1="3" y1="6" x2="15" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="11" y2="18" />
      <path d="M18 15l3 3-3 3" />
      <line x1="21" y1="18" x2="15" y2="18" />
    </svg>
  );
}

/* "Add to queue" hover button on a song card — same list glyph, plus a
   small "+" so it reads distinctly from the queue-drawer toggle above. */
export function QueueAddIcon(props) {
  return (
    <svg {...common} {...props}>
      <line x1="3" y1="6" x2="14" y2="6" />
      <line x1="3" y1="12" x2="14" y2="12" />
      <line x1="3" y1="18" x2="10" y2="18" />
      <line x1="19" y1="14" x2="19" y2="20" />
      <line x1="16" y1="17" x2="22" y2="17" />
    </svg>
  );
}

/* Drag handle shown next to each reorderable queue row. */
export function DragHandleIcon(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="9" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
