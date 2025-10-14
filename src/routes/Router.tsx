import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CatalogIndex from '../pages/catalog/Index';
import OrdersIndex from '../pages/orders/Index';
import Settings from '../pages/Settings';
import Tenants from '../pages/Tenants';

const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/catalog/*"
          element={
            <AppLayout>
              <CatalogIndex />
            </AppLayout>
          }
        />
        <Route
          path="/orders/*"
          element={
            <AppLayout>
              <OrdersIndex />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />
        <Route
          path="/tenants"
          element={
            <AppLayout>
              <Tenants />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;
