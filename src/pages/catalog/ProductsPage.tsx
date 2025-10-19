import React, { useCallback, useMemo, useState } from "react";
import DataTable, { Column } from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import FilterBar from "../../components/ui/FilterBar";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { productsApi } from "../../api/catalogApi";
import { Product, PagedResponse } from "../../types/catalog";
import { useHashQueryState } from "../../hooks/useHashQueryState";
import { useAsync } from "../../hooks/useAsync";
import { notify } from "../../utils/events";
import ProductsForm from "./ProductsForm";

const ProductsPage: React.FC = () => {
  const [q, setQ] = useHashQueryState({ search: "", page: "1", pageSize: "10", sortBy: "name", sortDir: "asc" });
  const page = Number(q.page || "1");
  const pageSize = Number(q.pageSize || "10");
  const [reloadFlag, setReloadFlag] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<Partial<Product> | null>(null);
  const [del, setDel] = useState<{ open: boolean; id?: string; busy?: boolean }>({ open: false });

  const columns: Column<Product>[] = useMemo(() => ([
    { key: "name", title: "Name", sortable: true },
    { key: "code", title: "Code", sortable: true },
    // If your API returns category name, show it:
    { key: "categoryName", title: "Category", sortable: true, render: (r) => (r as any).categoryName ?? "—" },
    { key: "createdAt", title: "Created", sortable: true, render: (r) => new Date(r.createdAt).toLocaleString() },
    {
      key: "id", title: "Actions", align: "right",
      render: (r) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button onClick={() => openEdit(r)}>Edit</Button>
          <Button variant="danger" onClick={() => setDel({ open: true, id: r.id })}>Delete</Button>
        </div>
      )
    },
  ]), []);

  const fetchData = useCallback(async (): Promise<PagedResponse<Product>> => {
    return await productsApi.list({ search: q.search, page, pageSize, sortBy: q.sortBy, sortDir: q.sortDir as "asc" | "desc" });
  }, [q.search, page, pageSize, q.sortBy, q.sortDir, reloadFlag]);

  const { data, loading, reload } = useAsync(fetchData, [fetchData]);

  const onSearchChange = (val: string) => setQ({ search: val, page: "1" });
  const onApply = () => setReloadFlag((x) => x + 1);
  const onPageChange = (p: { page?: number; pageSize?: number }) => {
    if (p.pageSize) setQ({ pageSize: String(p.pageSize), page: "1" });
    if (p.page) setQ({ page: String(p.page) });
  };
  const onSortChange = (s: { sortBy?: string; sortDir?: "asc" | "desc" }) => {
    setQ({ sortBy: s.sortBy ?? q.sortBy, sortDir: s.sortDir ?? q.sortDir, page: "1" });
  };

  function openNew() { setCurrent(null); setEditOpen(true); }
  function openEdit(r: Product) {
    setCurrent({ id: r.id, name: r.name, code: r.code, categoryId: (r as any).categoryId });
    setEditOpen(true);
  }

  async function handleSaved(saved: Product) {
    if (data?.items) {
      const idx = data.items.findIndex(x => x.id === saved.id);
      if (idx >= 0) {
        const copy = [...data.items]; copy[idx] = saved; (data.items as any) = copy;
      } else if (page === 1) {
        (data.items as any) = [saved, ...(data.items as any)];
        (data.total as any) = (data.total ?? 0) + 1;
      } else await reload();
    } else await reload();

    notify({ variant: "success", message: current?.id ? "Product updated." : "Product created." });
    setEditOpen(false); setCurrent(null);
  }

  async function confirmDelete() {
    if (!del.id) return;
    setDel(d => ({ ...d, busy: true }));
    try {
      const prev = data?.items || [];
      (data!.items as any) = prev.filter(x => x.id !== del.id);
      (data!.total as any) = Math.max(0, (data?.total ?? 1) - 1);
      await productsApi.remove(del.id);
      notify({ variant: "success", message: "Deleted." });
      setDel({ open: false });
    } catch (e: any) {
      notify({ variant: "error", message: e?.message || "Delete failed" });
      await reload(); setDel({ open: false });
    }
  }

  return (
    <>
      <h1>Catalog · Products</h1>

      <FilterBar
        search={q.search}
        onSearchChange={onSearchChange}
        onApply={onApply}
        rightSlot={<Button variant="primary" onClick={openNew}>New Product</Button>}
      />

      <DataTable<Product>
        columns={columns}
        rows={data?.items ?? null}
        loading={loading}
        sort={{ sortBy: q.sortBy, sortDir: q.sortDir as "asc" | "desc" }}
        onSortChange={onSortChange}
        page={{ page, pageSize, total: data?.total ?? 0 }}
      />

      <Pagination page={page} pageSize={pageSize} total={data?.total ?? 0} onChange={onPageChange} />

      <Modal
        open={editOpen}
        onClose={() => { setEditOpen(false); setCurrent(null); }}
        title={current?.id ? "Edit Product" : "New Product"}
      >
        <ProductsForm
          existing={current}
          onSaved={handleSaved}
          onCancel={() => { setEditOpen(false); setCurrent(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={del.open}
        onCancel={() => setDel({ open: false })}
        onConfirm={confirmDelete}
        busy={del.busy}
        title="Delete product?"
        message="This will remove the product permanently."
      />
    </>
  );
};

export default ProductsPage;
