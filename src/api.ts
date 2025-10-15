import { getSession } from './context/sessionStore';
import { notify } from './utils/events';
import { getTenantId } from './context/tenantStore'; 

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

async function request<T>(path: string, method: HttpMethod, body?: unknown, opts?: RequestInit, attempt = 0): Promise<T> {
  const session = getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts?.headers as Record<string, string> | undefined),
  };
  if (session?.accessToken) headers['Authorization'] = `Bearer ${session.accessToken}`;

  const tenantId = getTenantId();                 
  if (tenantId) headers['X-Tenant-Id'] = tenantId; 

  const res = await fetch(`${baseURL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

function normalizeError(status: number, bodyText: string): ApiError {
  // Try parse JSON error structure if backend returns it
  try {
    const data = JSON.parse(bodyText);
    const message = data?.message || data?.error || bodyText || `HTTP ${status}`;
    return { status, message, details: data };
  } catch {
    const msg = bodyText || `HTTP ${status}`;
    return { status, message: msg };
  }
}

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

async function request<T>(path: string, method: HttpMethod, body?: unknown, opts?: RequestInit, attempt = 0): Promise<T> {
  const session = getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts?.headers as Record<string, string> | undefined),
  };
  if (session?.accessToken) headers['Authorization'] = `Bearer ${session.accessToken}`;

  const res = await fetch(`${baseURL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });

  // Retry on 429/5xx with exponential backoff (max 3 attempts)
  if ((res.status === 429 || (res.status >= 500 && res.status < 600)) && attempt < 2) {
    const backoff = 300 * Math.pow(2, attempt); // 300, 600, 1200ms
    await sleep(backoff);
    return request<T>(path, method, body, opts, attempt + 1);
  }

  const text = await res.text();
  if (!res.ok) {
    const err = normalizeError(res.status, text);
    // User-friendly toast
    notify({
      variant: 'error',
      title: `Request failed (${err.status})`,
      message: err.message.length > 200 ? err.message.slice(0, 197) + '...' : err.message,
    });
    throw err;
  }

  // handle 204 No Content
  if (!text) return undefined as unknown as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    // Not JSON — return as text (rare)
    return text as unknown as T;
  }
}

export const api = {
  get:    <T>(path: string, opts?: RequestInit) => request<T>(path, 'GET', undefined, opts),
  post:   <T>(path: string, body?: unknown, opts?: RequestInit) => request<T>(path, 'POST', body, opts),
  put:    <T>(path: string, body?: unknown, opts?: RequestInit) => request<T>(path, 'PUT', body, opts),
  patch:  <T>(path: string, body?: unknown, opts?: RequestInit) => request<T>(path, 'PATCH', body, opts),
  delete: <T>(path: string, opts?: RequestInit) => request<T>(path, 'DELETE', undefined, opts),
};
