import { Session } from './types/auth';
import { getSession, setSession, clearSession } from './context/sessionStore';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown,
  opts?: RequestInit
): Promise<T> {
  const session: Session | null = getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts?.headers as Record<string, string> | undefined),
  };
  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  const res = await fetch(`${baseURL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });

  // try to refresh on 401 (placeholder — implement real refresh if backend supports it)
  if (res.status === 401) {
    // if you implement refresh:
    // const newTokens = await refresh();
    // if (newTokens) { setSession({...session, accessToken: newTokens.accessToken}); retry... }
    clearSession(); // fallback: log out
    // bubble up 401
  }

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

async function safeText(r: Response) {
  try { return await r.text(); } catch { return ''; }
}

export const api = {
  get: <T>(path: string, opts?: RequestInit) => request<T>(path, 'GET', undefined, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestInit) => request<T>(path, 'POST', body, opts),
  put:  <T>(path: string, body?: unknown, opts?: RequestInit) => request<T>(path, 'PUT', body, opts),
  patch:<T>(path: string, body?: unknown, opts?: RequestInit) => request<T>(path, 'PATCH', body, opts),
  delete:<T>(path: string, opts?: RequestInit) => request<T>(path, 'DELETE', undefined, opts),
};

// auth endpoints (adjust paths to match your backend)
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  me: () => api.get('/api/auth/me'),
};
