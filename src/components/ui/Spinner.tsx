import React from 'react';

const Spinner: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <span
    aria-label="Loading"
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      border: '3px solid var(--border)',
      borderTopColor: 'var(--primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }}
  />
);

export default Spinner;

/* Add this once in globals.css if not present:
@keyframes spin { to { transform: rotate(360deg); } }
*/
