import React, { useEffect, useMemo, useState } from 'react';
import Button from './Button';
import { normalizeSearch } from '../../utils/normalizeSearch';

type Option = { label: string; value: string; };

type Props = {
  search: string;
  onSearchChange: (val: string) => void;
  onApply: () => void;            // called on debounced change
  rightSlot?: React.ReactNode;    // place for extra filters/actions
  debounceMs?: number;            // default 350ms
};

const FilterBar: React.FC<Props> = ({ search, onSearchChange, onApply, rightSlot, debounceMs = 350 }) => {
  const [local, setLocal] = useState(search);

  useEffect(() => setLocal(search), [search]); // sync when search changes externally (pagination, reset)

  // Debounce apply
  useEffect(() => {
    const t = setTimeout(() => {
      const n = normalizeSearch(local);
      onSearchChange(n);
      onApply(); // trigger reload
    }, debounceMs);
    return () => clearTimeout(t);
  }, [local, debounceMs]); // eslint-disable-line react-hooks/exhaustive-deps

  const placeholder = useMemo(() => 'Search by name, code, …', []);

  return (
    <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, padding: '0.6rem 0.7rem', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
      />
      {rightSlot}
      <Button onClick={() => { setLocal(''); /* clears */ }}>Clear</Button>
    </div>
  );
};

export default FilterBar;
