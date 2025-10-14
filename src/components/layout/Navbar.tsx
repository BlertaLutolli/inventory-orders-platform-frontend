import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthProvider';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <strong>Inventory-Orders</strong>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {isAuthenticated && <span style={{ color: 'var(--muted)' }}>{user?.name}</span>}
        <ThemeToggle />
        {isAuthenticated && (
          <button className="btn" onClick={logout} aria-label="Logout">
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
