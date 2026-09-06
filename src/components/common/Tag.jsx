import './Tag.css';

const TAG_COLORS = {
  Punjabi: 'amber',
  Romantic: 'rose',
  Pop: 'teal',
  'Lo-fi': 'violet',
  Workout: 'amber',
  Party: 'violet',
  Chill: 'teal',
  Bollywood: 'rose',
  Trending: 'primary',
  Acoustic: 'teal',
};

export function Tag({ label, active = false, onClick, as = 'span' }) {
  const color = TAG_COLORS[label] || 'primary';
  const Component = onClick ? 'button' : as;
  return (
    <Component
      className={`tag tag-${color} ${active ? 'tag-active' : ''}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {label}
    </Component>
  );
}
