import React, { useEffect, useState } from 'react';
import Toast from './Toast';
import { events, ToastPayload } from '../../utils/events';

type Item = ToastPayload & { id: string };

const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const off = events.on<ToastPayload>('toast', (p) => {
      const id = crypto.randomUUID();
      setItems((curr) => [...curr, { id, ...p }]);
    });
    return off;
  }, []);

  const close = (id: string) => setItems((curr) => curr.filter(t => t.id !== id));

  return (
    <>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          display: 'grid',
          gap: 10,
          zIndex: 9999,
        }}
      >
        {items.map(t => (
          <Toast key={t.id} id={t.id} title={t.title} message={t.message} variant={t.variant} timeoutMs={t.timeoutMs} onClose={close} />
        ))}
      </div>
    </>
  );
};

export default ToastProvider;
