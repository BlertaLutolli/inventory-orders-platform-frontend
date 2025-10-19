// import { api } from '../api';
import { Tenant } from '../types/tenant';
import api from "./http";

export const tenantApi = {
  // Returns the list of tenants the current user can access
  list: () => api.get<Tenant[]>('/api/tenants'),
  // Optional: server-remember active tenant
  setActive: (tenantId: string) => api.post<void>('/api/tenants/active', { tenantId }),
};
