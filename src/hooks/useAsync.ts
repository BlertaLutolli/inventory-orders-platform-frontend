import { useCallback, useEffect, useRef, useState } from 'react';

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: any;
};

export function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
  const mounted = useRef(true);
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: false, error: null });

  const run = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await fn();
      if (mounted.current) setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      if (mounted.current) setState({ data: null, loading: false, error });
      throw error;
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mounted.current = true;
    run();
    return () => { mounted.current = false; };
  }, [run]);

  return { ...state, reload: run };
}
