import React, { useCallback, useMemo, useState } from "react";
import DataTable, { Column } from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import FilterBar from "../../components/ui/FilterBar";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { uomsApi } from "../../api/catalogApi";
import { UnitOfMeasure, PagedResponse } from "../../types/catalog";
import { useHashQueryState } from "../../hooks/useHashQueryState";
import { useAsync } from "../../hooks/useAsync";
import { notify } from "../../utils/events";
import UomsForm from "./UomsForm";

const UomsPage: React.FC = () => {
  const [q, setQ] = useHashQueryState({ search: "", page: "1", pageSize: "10", sortBy: "name", sortDir: "asc" });
  const page = Number(q.page || "1");
  const pageSize = Number(q.pageSize || "10");
  const [reloadFlag, setReloadFlag] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<Partial<UnitOfMeasure> | null>(null);
  const [del, setDel] = useState<{ open: boolean; id?: string; busy?: boolean }>({ open: false });

  const columns: Column<UnitOfMeasure>[] = useMemo(() => ([
    { key: "name", title: "Name", sortable: true },
    { key: "code", title: "Code", sortable: true },
    { key: "precision", title: "Precision", sortable: true },
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

  const fetchData = useCallback(async (): Promise<PagedResponse<UnitOfMeasure>> => {
    return await uomsApi.list({ search: q.search, page, pageSize, sortBy: q.sortBy, sortDir: q.sortDir as "asc" | "desc" });
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
  function openEdit(r: UnitOfMeasure) { setCurrent({ id: r.id, name: r.name, code: r.code, precision: r.precision }); setEditOpen(true); }

  async function handleSaved(saved: UnitOfMeasure) {
    if (data?.items) {
      const idx = data.items.findIndex(x => x.id === saved.id);
      if (idx >= 0) {
        const copy = [...data.items]; copy[idx] = saved; (data.items as any) = copy;
      } else if (page === 1) {
        (data.items as any) = [saved, ...(data.items as any)];
        (data.total as any) = (data.total ?? 0) + 1;
      } else await reload();
    } else await reload();

    notify({ variant: "success", message: current?.id ? "UoM updated." : "UoM created." });
    setEditOpen(false); setCurrent(null);
  }

  async function confirmDelete() {
    if (!del.id) return;
    setDel(d => ({ ...d, busy: true }));
    try {
      const prev = data?.items || [];
      (data!.items as any) = prev.filter(x => x.id !== del.id);
      (data!.total as any) = Math.max(0, (data?.total ?? 1) - 1);
      await uomsApi.remove(del.id);
      notify({ variant: "success", message: "Deleted." });
      setDel({ open: false });
    } catch (e: any) {
      notify({ variant: "error", message: e?.message || "Delete failed" });
      await reload(); setDel({ open: false });
    }
  }

  return (
    <>
      <h1>Catalog · Units of Measure</h1>

      <FilterBar
        search={q.search}
        onSearchChange={onSearchChange}
        onApply={onApply}
        rightSlot={<Button variant="primary" onClick={openNew}>New UoM</Button>}
      />

      <DataTable<UnitOfMeasure>
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
        title={current?.id ? "Edit UoM" : "New UoM"}
      >
        <UomsForm
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
        title="Delete UoM?"
        message="This will remove the unit permanently."
      />
    </>
  );
};

export default UomsPage;
