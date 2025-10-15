import React from 'react';
import Spinner from './Spinner';
import EmptyState from './EmptyState';

export type Column<T> = {
  key: keyof T | string;
  title: string;
  width?: string | number;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortKey?: string; // explicit server sort key if different from accessor
  align?: 'left' | 'right' | 'center';
};

type SortState = { sortBy?: string; sortDir?: 'asc' | 'desc'; };
type PageState = { page: number; pageSize: number; total: number; };

type Props<T> = {
  columns: Column<T>[];
  rows: T[] | null;
  loading?: boolean;
  sort: SortState;
  onSortChange: (next: SortState) => void;
  page: PageState;
  topRightSlot?: React.ReactNode; // e.g., "New item" button
};

function arrow(dir?: 'asc' | 'desc') {
  if (!dir) return '↕';
  return dir === 'asc' ? '↑' : '↓';
}

function getNextDir(curr?: 'asc' | 'desc'): 'asc' | 'desc' {
  return curr === 'asc' ? 'desc' : 'asc';
}

function DataTableInner<T>({
  columns, rows, loading, sort, onSortChange, page, topRightSlot
}: Props<T>) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 600 }}>Results</div>
        {topRightSlot}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {columns.map((c) => {
                const skey = (c.sortKey ?? (typeof c.key === 'string' ? c.key : String(c.key)));
                const isActive = sort.sortBy === skey;
                return (
                  <th
                    key={String(c.key)}
                    style={{
                      textAlign: c.align ?? 'left',
                      borderBottom: '1px solid var(--border)',
                      padding: '10px',
                      whiteSpace: 'nowrap',
                      cursor: c.sortable ? 'pointer' : 'default',
                      width: c.width,
                      userSelect: 'none'
                    }}
                    onClick={() => {
                      if (!c.sortable) return;
                      const nextDir = isActive ? getNextDir(sort.sortDir) : 'asc';
                      onSortChange({ sortBy: skey, sortDir: nextDir });
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {c.title}
                      {c.sortable ? <span style={{ color: isActive ? 'var(--primary)' : 'var(--muted)' }}>{arrow(isActive ? sort.sortDir : undefined)}</span> : null}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} style={{ padding: 20 }}><Spinner /> Loading…</td></tr>
            ) : !rows || rows.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ padding: 0 }}><EmptyState title="No results" message="Try another search or adjust filters." /></td></tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  {columns.map((c) => (
                    <td key={String(c.key)} style={{ padding: 10, textAlign: c.align ?? 'left' }}>
                      {c.render ? c.render(row) : (row as any)[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 8, color: 'var(--muted)' }}>
        Showing {(page.page - 1) * page.pageSize + 1}
        {'–'}
        {Math.min(page.page * page.pageSize, page.total)} of {page.total}
      </div>
    </div>
  );
}

function DataTable<T>(props: Props<T>) {
  return <DataTableInner {...props} />;
}

export default DataTable;
