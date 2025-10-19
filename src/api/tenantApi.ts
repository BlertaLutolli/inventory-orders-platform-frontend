// // import { api } from '../api';
// import { Tenant } from '../types/tenant';
// import api from "./http";

// export const tenantApi = {
//   // Returns the list of tenants the current user can access
//   list: () => api.get<Tenant[]>('/api/tenants'),
//   // Optional: server-remember active tenant
//   setActive: (tenantId: string) => api.post<void>('/api/tenants/active', { tenantId }),
// };

import api from "../api"; 
export type Tenant = { id: string; name: string };

export const tenantApi = {
  // returns plain data (not AxiosResponse)
  async list(): Promise<Tenant[]> {
    const { data } = await api.get<Tenant[]>("/api/tenants");
    return data;
  },

  /**
   * Optional: persist active tenant preference on the server.
   * Tries a few common endpoints; ignores 404s so FE won’t crash
   * if your backend doesn’t implement this.
   */
  async setActive(id: string): Promise<void> {
    try {
      await api.post("/api/tenants/active", { tenantId: id });
      return;
    } catch (e: any) {
      // fallbacks for other backends you might have
      try {
        await api.put(`/api/tenants/${id}/active`);
        return;
      } catch {
        try {
          await api.post("/api/tenants/set-active", { id });
        } catch {
          // swallow if not supported; this is best-effort
        }
      }
    }
  },
};
