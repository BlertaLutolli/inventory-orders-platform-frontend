import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Tenant } from '../types/tenant';
import { tenantApi } from '../api/tenantApi';
import { getTenantId, setTenantId } from './tenantStore';
import { notify } from '../utils/events';

type TenantCtx = {
  tenants: Tenant[] | null;
  tenantId: string | null;
  setActiveTenant: (id: string | null) => void;
  activeTenant: Tenant | null;
  loading: boolean;
};

const Ctx = createContext<TenantCtx | null>(null);

export const TenantProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[] | null>(null);
  const [tenantId, setTenantIdState] = useState<string | null>(getTenantId());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await tenantApi.list();
        setTenants(list);
        // If persisted tenant no longer valid, clear it.
        if (tenantId && !list.some(t => t.id === tenantId)) {
          setTenantIdState(null);
          setTenantId(null);
        }
      } catch (e: any) {
        notify({ variant: 'error', message: e?.message || 'Failed to load tenants' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setActiveTenant = (id: string | null) => {
    setTenantIdState(id);
    setTenantId(id);
    // optional call to server to save preference
    if (id) tenantApi.setActive(id).catch(() => {});
  };

  const activeTenant = useMemo(
    () => tenants?.find(t => t.id === tenantId) ?? null,
    [tenants, tenantId]
  );

  const value = useMemo(() => ({
    tenants, tenantId, setActiveTenant, activeTenant, loading
  }), [tenants, tenantId, activeTenant, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useTenant = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
};
