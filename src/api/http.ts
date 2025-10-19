import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  if (tenantId) cfg.headers["X-Tenant-Id"] = tenantId;
  return cfg;
});

export default api;
