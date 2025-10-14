import React from 'react';
import Spinner from './Spinner';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'danger';
  loading?: boolean;
};

const Button: React.FC<Props> = ({ variant = 'default', loading, children, disabled, ...rest }) => {
  const base = {
    default: { background: 'var(--bg-soft)', border: 'var(--border)', color: 'var(--text)' },
    primary: { background: 'var(--primary)', border: 'var(--primary)', color: 'var(--primary-contrast)' },
    danger:  { background: 'rgba(239,68,68,0.1)', border: '#ef4444', color: 'var(--text)' },
  }[variant];

  return (
    <button
      className="btn"
      disabled={disabled || loading}
      style={{ background: base.background, borderColor: base.border, color: base.color, opacity: disabled || loading ? 0.7 : 1 }}
      {...rest}
    >
      {loading ? <Spinner size={16} /> : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
