import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) => isActive ? 'active' : '';
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/#/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/#/catalog" className={linkClass}>Catalog</NavLink>
        <NavLink to="/#/orders" className={linkClass}>Orders</NavLink>
        <NavLink to="/#/tenants" className={linkClass}>Tenants</NavLink>
        <NavLink to="/#/settings" className={linkClass}>Settings</NavLink>
        <div style={{ marginTop: 'var(--space-4)', color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>
          <NavLink to="/#/login" className={linkClass}>Logout</NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
