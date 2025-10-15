import React, { useCallback, useMemo, useState } from 'react';
import DataTable, { Column } from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import FilterBar from '../../components/ui/FilterBar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FormRow from '../../components/ui/FormRow';
import { uomsApi } from '../../api/catalogApi';
import { Uom, PagedResponse } from '../../types/catalog';
import { useHashQueryState } from '../../hooks/useHashQueryState';
import { useAsync } from '../../hooks/useAsync';
import { notify } from '../../utils/events';

const UomsPage: React.FC = () => {
  const [q, setQ] = useHashQueryState({ search: '', page: '1', pageSize: '10', sortBy: 'name', sortDir: 'asc' });
  const page = Number(q.page || '1');
  const pageSize = Number(q.pageSize || '10');
  const [reloadFlag, setReloadFlag] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<Partial<Uom>>({ name: '', code: '' });
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState<{ open: boolean; id?: string; busy?: boolean }>({ open: false });

  const columns: Column<Uom>[] = useMemo(() => ([
    { key: 'name', title: 'Name', sortable: true },
    { key: 'code', title: 'Code', sortable: true },
    { key: 'createdAt', title: 'Created', sortable: true, render: (r) => new Date(r.createdAt).toLocaleString() },
    { key: 'id', title: 'Actions', align: 'right', render: (r) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={() => openEdit(r)}>Edit</Button>
        <Button variant="danger" onClick={() => setDel({ open: true, id: r.id })}>Delete</Button>
      </div>
    )},
  ]), []);

  const fetchData = useCallback(async (): Promise<PagedResponse<Uom>> => {
    return await uomsApi.list({ search: q.search, page, pageSize, sortBy: q.sortBy, sortDir: q.sortDir as 'asc' | 'desc' });
  }, [q.search, page, pageSize, q.sortBy, q.sortDir, reloadFlag]);

  const { data, loading, reload } = useAsync(fetchData, [fetchData]);

  const onSearchChange = (val: string) => setQ({ search: val, page: '1' });
  const onApply = () => setReloadFlag(x => x + 1);
  const onPageChange = (p: { page?: number; pageSize?: number }) => {
    if (p.pageSize) setQ({ pageSize: String(p.pageSize), page: '1' });
    if (p.page) setQ({ page: String(p.page) });
  };
  const onSortChange = (s: { sortBy?: string; sortDir?: 'asc' | 'desc' }) =>
    setQ({ sortBy: s.sortBy ?? q.sortBy, sortDir: s.sortDir ?? q.sortDir, page: '1' });

  function openNew() { setForm({ name: '', code: '' }); setEditOpen(true); }
  function openEdit(r: Uom) { setForm({ id: r.id, name: r.name, code: r.code }); setEditOpen(true); }

  async function save() {
    if (!form.name || !form.code) {
      notify({ variant: 'warning', message: 'Name and code are required.' });
      return;
    }
    setSaving(true);
    try {
      if (form.id) {
        const updated = await uomsApi.update(form.id, { name: form.name, code: form.code });
        if (data?.items) (data.items as any) = data.items.map(x => x.id === updated.id ? updated : x);
        notify({ variant: 'success', message: 'UoM updated.' });
      } else {
        const created = await uomsApi.create({ name: form.name, code: form.code });
        if (data?.items && page === 1) {
          (data.items as any) = [created, ...data.items];
          (data.total as any) = (data.total ?? 0) + 1;
        } else {
          await reload();
        }
        notify({ variant: 'success', message: 'UoM created.' });
      }
      setEditOpen(false);
    } catch (e: any) {
      notify({ variant: 'error', message: e?.message || 'Save failed' });
    } finally { setSaving(false); }
  }

  async function confirmDelete() {
    if (!del.id) return;
    setDel(d => ({ ...d, busy: true }));
    try {
      const prev = data?.items || [];
      (data!.items as any) = prev.filter(x => x.id !== del.id);
      (data!.total as any) = Math.max(0, (data?.total ?? 1) - 1);
      await uomsApi.remove(del.id);
      notify({ variant: 'success', message: 'Deleted.' });
      setDel({ open: false });
    } catch (e: any) {
      notify({ variant: 'error', message: e?.message || 'Delete failed' });
      await reload();
      setDel({ open: false });
    }
  }

  return (
    <>
      <h1>Catalog · Units of Measure</h1>

      <FilterBar search={q.search} onSearchChange={onSearchChange} onApply={onApply}
        rightSlot={<Button variant="primary" onClick={openNew}>New UoM</Button>} />

      <DataTable<Uom>
        columns={columns}
        rows={data?.items ?? null}
        loading={loading}
        sort={{ sortBy: q.sortBy, sortDir: q.sortDir as 'asc' | 'desc' }}
        onSortChange={onSortChange}
        page={{ page, pageSize, total: data?.total ?? 0 }}
      />

      <Pagination page={page} pageSize={pageSize} total={data?.total ?? 0} onChange={onPageChange} />

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={form.id ? 'Edit UoM' : 'New UoM'}
        footer={<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={save} loading={saving}>Save</Button>
        </div>}>
        <FormRow>
          <Input label="Name" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Code" value={form.code || ''} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
        </FormRow>
      </Modal>

      <ConfirmDialog open={del.open} onCancel={() => setDel({ open: false })} onConfirm={confirmDelete} busy={del.busy}
        title="Delete unit?" message="This will remove the unit permanently." />
    </>
  );
};

export default UomsPage;
