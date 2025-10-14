import React from 'react';
import Button from './Button';

type Props = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const EmptyState: React.FC<Props> = ({ title = 'Nothing here yet', message = 'Try adjusting your filters or add new data.', actionLabel, onAction }) => {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🗂️</div>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ color: 'var(--muted)' }}>{message}</p>
      {actionLabel && onAction ? <Button variant="primary" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
};

export default EmptyState;
