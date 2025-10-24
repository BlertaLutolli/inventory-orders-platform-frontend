import React from 'react';
import Button from './Button';

type Props = {
  page: number;         
  pageSize: number;      
  total: number;          
  onChange: (next: { page?: number; pageSize?: number }) => void;
  pageSizeOptions?: number[];
};

const Pagination: React.FC<Props> = ({
  page, pageSize, total, onChange, pageSizeOptions = [10, 25, 50]
}) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
      <div style={{ color: 'var(--muted)' }}>
        Page <strong>{page}</strong> of <strong>{pageCount}</strong> · {total} items
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)' }}>Rows</span>
          <select
            value={pageSize}
            onChange={(e) => onChange({ page: 1, pageSize: Number(e.target.value) })}
            style={{ padding: '0.3rem 0.4rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
          >
            {pageSizeOptions.map(ps => <option key={ps} value={ps}>{ps}</option>)}
          </select>
        </label>

        <Button onClick={() => onChange({ page: 1 })} disabled={!canPrev}>{'<<'}</Button>
        <Button onClick={() => onChange({ page: page - 1 })} disabled={!canPrev}>{'<'}</Button>
        <Button onClick={() => onChange({ page: page + 1 })} disabled={!canNext}>{'>'}</Button>
        <Button onClick={() => onChange({ page: pageCount })} disabled={!canNext}>{'>>'}</Button>
      </div>
    </div>
  );
};

export default Pagination;
