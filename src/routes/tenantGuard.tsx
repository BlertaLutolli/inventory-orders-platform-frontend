import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTenant } from '../context/TenantProvider';

export const RequireTenant: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { tenantId } = useTenant();
  const location = useLocation();

  const path = location.pathname.toLowerCase();
  if (!tenantId && path !== '/tenants') {
    return <Navigate to="/tenants" replace />;
  }
  return <>{children}</>;
};
