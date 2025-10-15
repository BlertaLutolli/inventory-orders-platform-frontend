import React, { useCallback, useMemo, useState } from 'react';
import DataTable, { Column } from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import FilterBar from '../../components/ui/FilterBar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FormRow from '../../components/ui/FormRow';
import { categoriesApi } from '../../api/catalogApi';
import { Category, PagedResponse } from '../../types/catalog';
import { useHashQueryState } from '../../hooks/useHashQueryState';
import { useAsync } from '../../hooks/useAsync';
import { notify } from '../../utils/events';

const emptyCategory: Partial<Category> = { name: '', code: '' };

const CategoriesPage: React.FC = () => {
  const [q, setQ] = useHashQueryState({ search: '', page: '1', pageSize: '10', sortBy: 'name', sortDir: 'asc' });
  const page = Number(q.page || '1');
  const pageSize = Number(q.pageSize || '10');

  const [reloadFlag, setReloadFlag] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<Partial<Category>>(emptyCategory);
  const [saving, setSaving] = useState(false);

  const [del, setDel] = useState<{ open: boolean; id?: string; busy?: boolean }>({ open: false });

  const columns: Column<Category>[] = useMemo(() => ([
    { key: 'name', title: 'Name', sortable: true },
    { key: 'code', title: 'Code', sortable: true },
    { key: 'createdAt', title: 'Created', sortable: true, render: (r) => new Date(r.createdAt).toLocaleString() },
    {
      key: 'id', title: 'Actions', align: 'right',
      render: (r) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={() => openEdit(r)}>Edit</Button>
          <Button variant="danger" onClick={() => setDel({ open: true, id: r.id })}>Delete</Button>
        </div>
      )
    },
  ]), []);

  const fetchData = useCallback(async (): Promise<PagedResponse<Category>> => {
    return await categoriesApi.list({
      search: q.search, page, pageSize, sortBy: q.sortBy, sortDir: q.sortDir as 'asc' | 'desc'
    });
  }, [q.search, page, pageSize, q.sortBy, q.sortDir, reloadFlag]);

  const { data, loading, reload } = useAsync(fetchData, [fetchData]);

  const onSearchChange = (val: string) => setQ({ search: val, page: '1' });
  const onApply = () => setReloadFlag((x) => x + 1);
  const onPageChange = (p: { page?: number; pageSize?: number }) => {
    if (p.pageSize) setQ({ pageSize: String(p.pageSize), page: '1' });
    if (p.page) setQ({ page: String(p.page) });
  };
  const onSortChange = (s: { sortBy?: string; sortDir?: 'asc' | 'desc' }) => {
    setQ({ sortBy: s.sortBy ?? q.sortBy, sortDir: s.sortDir ?? q.sortDir, page: '1' });
  };

  function openNew() {
    setForm(emptyCategory);
    setEditOpen(true);
  }
  function openEdit(r: Category) {
    setForm({ id: r.id, name: r.name, code: r.code });
    setEditOpen(true);
  }

  // optimistic create/update
  async function save() {
    if (!form.name || !form.code) {
      notify({ variant: 'warning', message: 'Name and code are required.' });
      return;
    }
    setSaving(true);
    try {
      if (form.id) {
        const updated = await categoriesApi.update(form.id, { name: form.name, code: form.code });
        // optimistic UI: patch local cache
        if (data?.items) {
          const copy = data.items.map(x => (x.id === updated.id ? updated : x));
          (data.items as any) = copy; // quick patch; optional — reload also okay
        }
        notify({ variant: 'success', message: 'Category updated.' });
      } else {
        const created = await categoriesApi.create({ name: form.name, code: form.code });
        // prepend to list if on first page
        if (data?.items && page === 1) {
          (data.items as any) = [created, ...data.items];
          (data.total as any) = (data.total ?? 0) + 1;
        } else {
          // fallback: reload to see it
          await reload();
        }
        notify({ variant: 'success', message: 'Category created.' });
      }
      setEditOpen(false);
    } catch (e: any) {
      notify({ variant: 'error', message: e?.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!del.id) return;
    setDel(d => ({ ...d, busy: true }));
    try {
      // optimistic remove
      const prev = data?.items || [];
      (data!.items as any) = prev.filter(x => x.id !== del.id);
      (data!.total as any) = Math.max(0, (data?.total ?? 1) - 1);

      await categoriesApi.remove(del.id);
      notify({ variant: 'success', message: 'Deleted.' });
      setDel({ open: false });
    } catch (e: any) {
      notify({ variant: 'error', message: e?.message || 'Delete failed' });
      await reload(); // rollback
      setDel({ open: false });
    }
  }

  return (
    <>
      <h1>Catalog · Categories</h1>

      <FilterBar
        search={q.search}
        onSearchChange={onSearchChange}
        onApply={onApply}
        rightSlot={<Button variant="primary" onClick={openNew}>New Category</Button>}
      />

      <DataTable<Category>
        columns={columns}
        rows={data?.items ?? null}
        loading={loading}
        sort={{ sortBy: q.sortBy, sortDir: q.sortDir as 'asc' | 'desc' }}
        onSortChange={onSortChange}
        page={{ page, pageSize, total: data?.total ?? 0 }}
      />

      <Pagination page={page} pageSize={pageSize} total={data?.total ?? 0} onChange={onPageChange} />

      {/* Create/Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={form.id ? 'Edit Category' : 'New Category'}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={save} loading={saving}>Save</Button>
          </div>
        }
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <FormRow>
            <Input label="Name" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Code" value={form.code || ''} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
          </FormRow>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={del.open}
        onCancel={() => setDel({ open: false })}
        onConfirm={confirmDelete}
        busy={del.busy}
        title="Delete category?"
        message="This will remove the category permanently."
      />
    </>
  );
};

export default CategoriesPage;
