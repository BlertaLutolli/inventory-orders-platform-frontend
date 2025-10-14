import { Session } from '../types/auth';

const KEY = 'session';

let inMemory: Session | null = null;

export function getSession(): Session | null {
  if (inMemory) return inMemory;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    inMemory = JSON.parse(raw) as Session;
    return inMemory;
  } catch {
    localStorage.removeItem(KEY);
    return null;
  }
}

export function setSession(s: Session): void {
  inMemory = s;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession(): void {
  inMemory = null;
  localStorage.removeItem(KEY);
}
