import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthProvider';
import TenantSwitcher from '../ui/TenantSwitcher';
import { useTenant } from '../../context/TenantProvider';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { activeTenant } = useTenant();

  return (
    <header className="navbar">
      <strong>Inventory-Orders</strong>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {isAuthenticated && activeTenant && (
          <span style={{ color: 'var(--muted)' }}>
            {activeTenant.name}
          </span>
        )}
        {isAuthenticated && <TenantSwitcher />}
        <ThemeToggle />
        {isAuthenticated && (
          <button className="btn" onClick={logout} aria-label="Logout">Logout</button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
