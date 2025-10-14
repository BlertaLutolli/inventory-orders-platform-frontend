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

const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />

        {/* private */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/catalog/*"
          element={
            <RequireAuth>
              <AppLayout>
                <CatalogIndex />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/orders/*"
          element={
            <RequireAuth>
              <AppLayout>
                <OrdersIndex />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/tenants"
          element={
            <RequireAuth>
              <AppLayout>
                <Tenants />
              </AppLayout>
            </RequireAuth>
          }
        />
        {/* admin-only */}
        <Route
          path="/settings"
          element={
            <RequireRole role="Admin">
              <AppLayout>
                <Settings />
              </AppLayout>
            </RequireRole>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;
