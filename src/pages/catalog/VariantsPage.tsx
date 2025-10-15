import React, { useCallback, useMemo, useState } from 'react';
import DataTable, { Column } from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import FilterBar from '../../components/ui/FilterBar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FormRow from '../../components/ui/FormRow';
import { variantsApi, productsApi } from '../../api/catalogApi';
import { Variant, Product, PagedResponse } from '../../types/catalog';
import { useHashQueryState } from '../../hooks/useHashQueryState';
import { useAsync } from '../../hooks/useAsync';
import { notify } from '../../utils/events';

const VariantsPage: React.FC = () => {
  const [q, setQ] = useHashQueryState({ search: '', page: '1', pageSize: '10', sortBy: 'name', sortDir: 'asc' });
  const page = Number(q.page || '1');
  const pageSize = Number(q.pageSize || '10');
  const [reloadFlag, setReloadFlag] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<Partial<Variant>>({ productId: '', name: '', sku: '' });
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState<{ open: boolean; id?: string; busy?: boolean }>({ open: false });

  // preload products
  const { data: prods } = useAsync(async () => (await productsApi.list({ page: 1, pageSize: 200 })).items, []);

  const columns: Column<Variant>[] = useMemo(() => ([
    { key: 'name', title: 'Name', sortable: true },
    { key: 'sku', title: 'SKU', sortable: true },
    { key: 'productId', title: 'Product', render: (r) => prods?.find(p => p.id === r.productId)?.name || '—' },
    { key: 'createdAt', title: 'Created', sortable: true, render: (r) => new Date(r.createdAt).toLocaleString() },
    { key: 'id', title: 'Actions', align: 'right', render: (r) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={() => openEdit(r)}>Edit</Button>
        <Button variant="danger" onClick={() => setDel({ open: true, id: r.id })}>Delete</Button>
      </div>
    )},
  ]), [prods]);

  const fetchData = useCallback(async (): Promise<PagedResponse<Variant>> => {
    return await variantsApi.list({ search: q.search, page, pageSize, sortBy: q.sortBy, sortDir: q.sortDir as 'asc' | 'desc' });
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

  function openNew() {
    setForm({ productId: prods?.[0]?.id || '', name: '', sku: '' });
    setEditOpen(true);
  }
  function openEdit(r: Variant) {
    setForm({ id: r.id, productId: r.productId, name: r.name, sku: r.sku });
    setEditOpen(true);
  }

  async function save() {
    if (!form.productId || !form.name || !form.sku) {
      notify({ variant: 'warning', message: 'Product, name and SKU are required.' });
      return;
    }
    setSaving(true);
    try {
      if (form.id) {
        const updated = await variantsApi.update(form.id, { productId: form.productId, name: form.name, sku: form.sku });
        if (data?.items) (data.items as any) = data.items.map(x => x.id === updated.id ? updated : x);
        notify({ variant: 'success', message: 'Variant updated.' });
      } else {
        const created = await variantsApi.create({ productId: form.productId, name: form.name, sku: form.sku });
        if (data?.items && page === 1) {
          (data.items as any) = [created, ...data.items];
          (data.total as any) = (data.total ?? 0) + 1;
        } else { await reload(); }
        notify({ variant: 'success', message: 'Variant created.' });
      }
      setEditOpen(false);
    } catch (e: any) {
      if (e?.status === 409) {
        notify({ variant: 'warning', title: 'Duplicate SKU', message: 'A product or variant with this SKU already exists.' });
      } else {
        notify({ variant: 'error', message: e?.message || 'Save failed' });
      }
    } finally { setSaving(false); }
  }

  async function confirmDelete() {
    if (!del.id) return;
    setDel(d => ({ ...d, busy: true }));
    try {
      const prev = data?.items || [];
      (data!.items as any) = prev.filter(x => x.id !== del.id);
      (data!.total as any) = Math.max(0, (data?.total ?? 1) - 1);
      await variantsApi.remove(del.id);
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
      <h1>Catalog · Variants</h1>

      <FilterBar search={q.search} onSearchChange={onSearchChange} onApply={onApply}
        rightSlot={<Button variant="primary" onClick={openNew}>New Variant</Button>} />

      <DataTable<Variant>
        columns={columns}
        rows={data?.items ?? null}
        loading={loading}
        sort={{ sortBy: q.sortBy, sortDir: q.sortDir as 'asc' | 'desc' }}
        onSortChange={onSortChange}
        page={{ page, pageSize, total: data?.total ?? 0 }}
      />

      <Pagination page={page} pageSize={pageSize} total={data?.total ?? 0} onChange={onPageChange} />

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={form.id ? 'Edit Variant' : 'New Variant'}
        footer={<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={save} loading={saving}>Save</Button>
        </div>}>
        <div style={{ display: 'grid', gap: 12 }}>
          <FormRow>
            <label>
              <div>Product</div>
              <select value={form.productId || ''} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))} style={{ padding: '0.6rem 0.7rem', borderRadius: 10, border: '1px solid var(--border)' }}>
                {(prods || []).map((p: Product) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <Input label="Name" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </FormRow>
          <FormRow columns={1}>
            <Input label="SKU" value={form.sku || ''} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
          </FormRow>
        </div>
      </Modal>

      <ConfirmDialog open={del.open} onCancel={() => setDel({ open: false })} onConfirm={confirmDelete} busy={del.busy}
        title="Delete variant?" message="This will remove the variant permanently." />
    </>
  );
};

export default VariantsPage;
