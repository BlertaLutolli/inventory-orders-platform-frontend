import React from 'react';
import Button from './Button';

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  footer?: React.ReactNode;
};

const Modal: React.FC<React.PropsWithChildren<Props>> = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
        display: 'grid', placeItems: 'center', zIndex: 9998, padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: 640, width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <Button onClick={onClose}>✕</Button>
        </div>
        <div>{children}</div>
        {footer ? <div style={{ marginTop: 16 }}>{footer}</div> : null}
      </div>
    </div>
  );
};

export default Modal;
