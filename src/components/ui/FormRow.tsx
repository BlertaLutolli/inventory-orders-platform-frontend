import React from 'react';

const FormRow: React.FC<React.PropsWithChildren<{ columns?: number }>> = ({ columns = 2, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 12 }}>
    {children}
  </div>
);
export default FormRow;
