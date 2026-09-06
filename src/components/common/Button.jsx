import './Button.css';

export function Button({ variant = 'primary', size = 'md', icon, children, ...props }) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} {...props}>
      {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
