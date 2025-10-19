import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_BASE_URL?.trim() ||
  "http://localhost:5127"; // fallback for dev

const api = axios.create({ baseURL });

api.interceptors.request.use((cfg) => {
  // headers can be undefined on the config object, make sure it's an object
  cfg.headers = cfg.headers ?? {};

  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");

  if (token) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cfg.headers as any).Authorization = `Bearer ${token}`;
  }
  if (tenantId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cfg.headers as any)["X-Tenant-Id"] = tenantId;
  }
  return cfg;
});

export default api;
