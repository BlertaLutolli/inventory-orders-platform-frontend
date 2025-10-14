import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <strong>Inventory-Orders</strong>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
