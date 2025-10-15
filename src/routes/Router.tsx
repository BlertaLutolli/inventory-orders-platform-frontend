import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CatalogIndex from '../pages/catalog/Index';
import OrdersIndex from '../pages/orders/Index';
import Settings from '../pages/Settings';
import Tenants from '../pages/Tenants';

import { RequireAuth, RequireRole } from './guards';
import { RequireTenant } from './tenantGuard'; // ⬅️ NEW

const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/tenants" element={
          <RequireAuth>
            <AppLayout><Tenants /></AppLayout>
          </RequireAuth>
        } />

        {/* private + tenant required */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <RequireTenant>
                <AppLayout><Dashboard /></AppLayout>
              </RequireTenant>
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <RequireTenant>
                <AppLayout><Dashboard /></AppLayout>
              </RequireTenant>
            </RequireAuth>
          }
        />
        <Route
          path="/catalog/*"
          element={
            <RequireAuth>
              <RequireTenant>
                <AppLayout><CatalogIndex /></AppLayout>
              </RequireTenant>
            </RequireAuth>
          }
        />
        <Route
          path="/orders/*"
          element={
            <RequireAuth>
              <RequireTenant>
                <AppLayout><OrdersIndex /></AppLayout>
              </RequireTenant>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireRole role="Admin">
              <RequireTenant>
                <AppLayout><Settings /></AppLayout>
              </RequireTenant>
            </RequireRole>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;
