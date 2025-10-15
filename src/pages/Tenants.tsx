import React from 'react';
import { useTenant } from '../context/TenantProvider';
import Button from '../components/ui/Button';

const Tenants: React.FC = () => {
  const { tenants, tenantId, setActiveTenant, loading } = useTenant();

  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <h1>Choose a tenant</h1>
      <p style={{ color: 'var(--muted)' }}>
        Pick the organization/workspace to scope your data and requests.
      </p>

      {loading ? <p>Loading tenants…</p> : null}

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        {(tenants || []).map(t => (
          <label key={t.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{t.name}</div>
              {t.code ? <div style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>{t.code}</div> : null}
            </div>
            <Button
              variant={tenantId === t.id ? 'primary' : 'default'}
              onClick={() => setActiveTenant(t.id)}
            >
              {tenantId === t.id ? 'Selected' : 'Select'}
            </Button>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Tenants;
