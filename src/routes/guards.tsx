import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { Role } from '../types/auth';

export const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <>{children}</>;
};

export const RequireRole: React.FC<React.PropsWithChildren<{ role: Role }>> = ({ role, children }) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!hasRole(role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};
