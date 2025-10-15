import React from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import CategoriesPage from './CategoriesPage';
import UomsPage from './UomsPage';
import ProductsPage from './ProductsPage';
import VariantsPage from './VariantsPage';

const TabLink: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''} style={{
    padding: '0.5rem 0.75rem', borderRadius: 10, border: '1px solid var(--border)', marginRight: 8
  }}>{label}</NavLink>
);

const CatalogIndex: React.FC = () => {
  return (
    <>
      <h1>Catalog</h1>
      <div style={{ marginBottom: 12 }}>
        <TabLink to="/#/catalog/categories" label="Categories" />
        <TabLink to="/#/catalog/uoms" label="UoMs" />
        <TabLink to="/#/catalog/products" label="Products" />
        <TabLink to="/#/catalog/variants" label="Variants" />
      </div>

      <Routes>
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/uoms" element={<UomsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/variants" element={<VariantsPage />} />
        <Route path="*" element={<Navigate to="/catalog/categories" replace />} />
      </Routes>
    </>
  );
};

export default CatalogIndex;
