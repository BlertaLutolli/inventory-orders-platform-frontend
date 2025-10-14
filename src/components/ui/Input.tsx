import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  hint?: string;
};

const Input: React.FC<Props> = ({ label, error, hint, ...rest }) => {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      {label && <div>{label}</div>}
      <input
        {...rest}
        style={{
          width: '100%',
          padding: '0.6rem 0.7rem',
          borderRadius: '8px',
          border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
          outline: 'none',
          background: 'var(--bg)',
          color: 'var(--text)',
        }}
      />
      {error ? (
        <div style={{ color: '#ef4444', fontSize: 'var(--fs-sm)' }}>{error}</div>
      ) : hint ? (
        <div style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>{hint}</div>
      ) : null}
    </label>
  );
};

export default Input;
