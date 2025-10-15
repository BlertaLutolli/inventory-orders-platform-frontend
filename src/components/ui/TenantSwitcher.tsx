import React from 'react';
import { useTenant } from '../../context/TenantProvider';
import Spinner from './Spinner';

const TenantSwitcher: React.FC = () => {
  const { tenants, tenantId, setActiveTenant, loading } = useTenant();

  if (loading) return <Spinner size={16} />;
  if (!tenants || tenants.length === 0) return null;

  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: 'var(--muted)' }}>Tenant</span>
      <select
        value={tenantId ?? ''}
        onChange={(e) => setActiveTenant(e.target.value || null)}
        style={{ padding: '0.4rem 0.5rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
      >
        <option value="" disabled>Select…</option>
        {tenants.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
    </label>
  );
};

export default TenantSwitcher;
