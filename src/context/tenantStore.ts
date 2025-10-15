const KEY = 'activeTenantId';
let inMemory: string | null = null;

export function getTenantId(): string | null {
  if (inMemory) return inMemory;
  const v = localStorage.getItem(KEY);
  inMemory = v || null;
  return inMemory;
}

export function setTenantId(id: string | null): void {
  inMemory = id;
  if (id) localStorage.setItem(KEY, id);
  else localStorage.removeItem(KEY);
}
