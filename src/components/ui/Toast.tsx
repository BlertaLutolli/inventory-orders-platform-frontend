import React, { useEffect } from 'react';

type Props = {
  id: string;
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onClose: (id: string) => void;
  timeoutMs?: number;
};

const bgByVariant: Record<NonNullable<Props['variant']>, string> = {
  info: 'rgba(59,130,246,0.15)',
  success: 'rgba(16,185,129,0.15)',
  warning: 'rgba(245,158,11,0.15)',
  error: 'rgba(239,68,68,0.15)',
};

const borderByVariant: Record<NonNullable<Props['variant']>, string> = {
  info: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const Toast: React.FC<Props> = ({ id, title, message, variant = 'info', onClose, timeoutMs = 4500 }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), timeoutMs);
    return () => clearTimeout(t);
  }, [id, onClose, timeoutMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: bgByVariant[variant],
        borderLeft: `4px solid ${borderByVariant[variant]}`,
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(6px)',
        color: 'var(--text)',
        minWidth: 260,
      }}
    >
      {title && <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>}
      <div>{message}</div>
    </div>
  );
};

export default Toast;
