import { useCallback, useEffect, useMemo, useState } from 'react';

function parseHashQuery(): URLSearchParams {
  const hash = window.location.hash || '';
  const qIndex = hash.indexOf('?');
  return new URLSearchParams(qIndex >= 0 ? hash.slice(qIndex + 1) : '');
}

function replaceHashQuery(params: URLSearchParams) {
  const hash = window.location.hash || '#/';
  const path = hash.split('?')[0];
  const next = `${path}?${params.toString()}`;
  // avoid adding history entries
  window.history.replaceState(null, '', next);
}

export function useHashQueryState<T extends Record<string, string>>(
  defaults: T
): [T, (patch: Partial<T>) => void, URLSearchParams] {
  const [params, setParams] = useState<URLSearchParams>(() => {
    const p = parseHashQuery();
    // seed defaults if missing
    Object.entries(defaults).forEach(([k, v]) => {
      if (!p.has(k)) p.set(k, v);
    });
    replaceHashQuery(p);
    return p;
  });

  useEffect(() => {
    const onHash = () => setParams(parseHashQuery());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const state = useMemo(() => {
    const obj = {} as T;
    Object.keys(defaults).forEach((k) => {
      obj[k as keyof T] = (params.get(k) ?? defaults[k]) as T[keyof T];
    });
    return obj;
  }, [params, defaults]);

  const update = useCallback((patch: Partial<T>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') next.delete(k);
      else next.set(k, String(v));
    });
    replaceHashQuery(next);
    setParams(next);
  }, [params]);

  return [state, update, params];
}
