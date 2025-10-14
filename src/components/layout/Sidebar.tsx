import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const Sidebar: React.FC = () => {
  const { isAuthenticated, roles } = useAuth();
  const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

  if (!isAuthenticated) return null;

  const canSeeAdmin = roles.includes('Admin');

  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/#/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/#/catalog" className={linkClass}>Catalog</NavLink>
        <NavLink to="/#/orders" className={linkClass}>Orders</NavLink>
        <NavLink to="/#/tenants" className={linkClass}>Tenants</NavLink>
        {canSeeAdmin && <NavLink to="/#/settings" className={linkClass}>Settings</NavLink>}
      </nav>
    </aside>
  );
};

export default Sidebar;
