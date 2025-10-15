import React, { useCallback, useMemo, useState } from 'react';
import DataTable, { Column } from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import FilterBar from '../../components/ui/FilterBar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FormRow from '../../components/ui/FormRow';
import { productsApi, categoriesApi, uomsApi } from '../../api/catalogApi';
import { Product, Category, Uom, PagedResponse } from '../../types/catalog';
import { useHashQueryState } from '../../hooks/useHashQueryState';
import { useAsync } from '../../hooks/useAsync';
import { notify } from '../../utils/events';

const ProductsPage: React.FC = () => {
  const [q, setQ] = useHashQueryState({ search: '', page: '1', pageSize: '10', sortBy: 'name', sortDir: 'asc' });
  const page = Number(q.page || '1');
  const pageSize = Number(q.pageSize || '10');
  const [reloadFlag, setReloadFlag] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({ name: '', sku: '', categoryId: '', uomId: '' });
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState<{ open: boolean; id?: string; busy?: boolean }>({ open: false });

  // preload categories/uoms for selects
  const { data: cats } = useAsync(async () => (await categoriesApi.list({ page: 1, pageSize: 100 })).items, []);
  const { data: uoms } = useAsync(async () => (await uomsApi.list({ page: 1, pageSize: 100 })).items, []);

  const columns: Column<Product>[] = useMemo(() => ([
    { key: 'name', title: 'Name', sortable: true },
    { key: 'sku', title: 'SKU', sortable: true },
    { key: 'categoryId', title: 'Category', render: (r) => cats?.find(c => c.id === r.categoryId)?.name || '—' },
    { key: 'uomId', title: 'UoM', render: (r) => uoms?.find(u => u.id === r.uomId)?.code || '—' },
    { key: 'createdAt', title: 'Created', sortable: true, render: (r) => new Date(r.createdAt).toLocaleString() },
    { key: 'id', title: 'Actions', align: 'right', render: (r) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={() => openEdit(r)}>Edit</Button>
        <Button variant="danger" onClick={() => setDel({ open: true, id: r.id })}>Delete</Button>
      </div>
    ) },
  ]), [cats, uoms]);

  const fetchData = useCallback(async (): Promise<PagedResponse<Product>> => {
    return await productsApi.list({ search: q.search, page, pageSize, sortBy: q.sortBy, sortDir: q.sortDir as 'asc' | 'desc' });
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

  function openNew() { setForm({ name: '', sku: '', categoryId: cats?.[0]?.id || '', uomId: uoms?.[0]?.id || '' }); setEditOpen(true); }
  function openEdit(r: Product) { setForm({ id: r.id, name: r.name, sku: r.sku, categoryId: r.categoryId, uomId: r.uomId }); setEditOpen(true); }

  async function save() {
    if (!form.name || !form.sku || !form.categoryId || !form.uomId) {
      notify({ variant: 'warning', message: 'Name, SKU, Category and UoM are required.' });
      return;
    }
    setSaving(true);
    try {
      if (form.id) {
        const updated = await productsApi.update(form.id, { name: form.name, sku: form.sku, categoryId: form.categoryId, uomId: form.uomId });
        if (data?.items) (data.items as any) = data.items.map(x => x.id === updated.id ? updated : x);
        notify({ variant: 'success', message: 'Product updated.' });
      } else {
        const created = await productsApi.create({ name: form.name, sku: form.sku, categoryId: form.categoryId, uomId: form.uomId });
        if (data?.items && page === 1) {
          (data.items as any) = [created, ...data.items];
          (data.total as any) = (data.total ?? 0) + 1;
        } else { await reload(); }
        notify({ variant: 'success', message: 'Product created.' });
      }
      setEditOpen(false);
    } catch (e: any) {
      // ✅ Unique SKU error (backend should return 409)
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
      await productsApi.remove(del.id);
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
      <h1>Catalog · Products</h1>

      <FilterBar search={q.search} onSearchChange={onSearchChange} onApply={onApply}
        rightSlot={<Button variant="primary" onClick={openNew}>New Product</Button>} />

      <DataTable<Product>
        columns={columns}
        rows={data?.items ?? null}
        loading={loading}
        sort={{ sortBy: q.sortBy, sortDir: q.sortDir as 'asc' | 'desc' }}
        onSortChange={onSortChange}
        page={{ page, pageSize, total: data?.total ?? 0 }}
      />

      <Pagination page={page} pageSize={pageSize} total={data?.total ?? 0} onChange={onPageChange} />

      {/* Create/Edit */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={form.id ? 'Edit Product' : 'New Product'}
        footer={<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={save} loading={saving}>Save</Button>
        </div>}>
        <div style={{ display: 'grid', gap: 12 }}>
          <FormRow>
            <Input label="Name" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="SKU" value={form.sku || ''} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
          </FormRow>
          <FormRow>
            <label>
              <div>Category</div>
              <select value={form.categoryId || ''} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={{ padding: '0.6rem 0.7rem', borderRadius: 10, border: '1px solid var(--border)' }}>
                {(cats || []).map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label>
              <div>UoM</div>
              <select value={form.uomId || ''} onChange={e => setForm(f => ({ ...f, uomId: e.target.value }))} style={{ padding: '0.6rem 0.7rem', borderRadius: 10, border: '1px solid var(--border)' }}>
                {(uoms || []).map((u: Uom) => <option key={u.id} value={u.id}>{u.code}</option>)}
              </select>
            </label>
          </FormRow>
        </div>
      </Modal>

      {/* Delete */}
      <ConfirmDialog open={del.open} onCancel={() => setDel({ open: false })} onConfirm={confirmDelete} busy={del.busy}
        title="Delete product?" message="This will remove the product permanently." />
    </>
  );
};

export default ProductsPage;
