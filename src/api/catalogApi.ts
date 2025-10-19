// import { api } from '../api';
import { Category, Product, Variant, PagedResponse } from '../types/catalog';
import api from "./http";

export const categoriesApi = {
  list: async (q: {
    search?: string; page?: number; pageSize?: number;
    sortBy?: string; sortDir?: "asc" | "desc";
  }) => {
    const { data } = await api.get<PagedResponse<any>>("/api/categories", { params: q });
    return data;
  },

  create: async (payload: { name: string; code: string }) => {
    const { data } = await api.post("/api/categories", payload);
    return data;
  },

  update: async (id: string, payload: { name: string; code: string }) => {
    const { data } = await api.put(`/api/categories/${id}`, payload);
    return data;
  },

  remove: async (id: string) => {
    await api.delete(`/api/categories/${id}`);
  },
};

export const uomsApi = {
  list: async (q: { search?: string; page?: number; pageSize?: number; sortBy?: string; sortDir?: "asc" | "desc"; }) => {
    const { data } = await api.get<PagedResponse<any>>("/api/uoms", { params: q });
    return data;
  },
  all: async () => {
    const { data } = await api.get<any[]>("/api/uoms/all");
    return data;
  },
  create: async (payload: { name: string; code: string; precision?: number }) => {
    const { data } = await api.post("/api/uoms", payload);
    return data;
  },
  update: async (id: string, payload: { name: string; code: string; precision?: number }) => {
    const { data } = await api.put(`/api/uoms/${id}`, payload);
    return data;
  },
  remove: async (id: string) => { await api.delete(`/api/uoms/${id}`); },
};

export const productsApi = {
  list: async (q: { search?: string; page?: number; pageSize?: number; sortBy?: string; sortDir?: "asc" | "desc"; }) => {
    const { data } = await api.get<PagedResponse<any>>("/api/products", { params: q });
    return data;
  },
  all: async () => {
    const { data } = await api.get<any[]>("/api/products/all");
    return data;
  },
  create: async (payload: { name: string; code: string; categoryId?: string }) => {
    const { data } = await api.post("/api/products", payload);
    return data;
  },
  update: async (id: string, payload: { name: string; code: string; categoryId?: string }) => {
    const { data } = await api.put(`/api/products/${id}`, payload);
    return data;
  },
  remove: async (id: string) => { await api.delete(`/api/products/${id}`); },
};

export const variantsApi = {
  list: async (q: { search?: string; page?: number; pageSize?: number; sortBy?: string; sortDir?: "asc" | "desc"; }) => {
    const { data } = await api.get<PagedResponse<any>>("/api/variants", { params: q });
    return data;
  },
  create: async (payload: { productId: string; uomId: string; sku: string; price: number }) => {
    const { data } = await api.post("/api/variants", payload);
    return data;
  },
  update: async (id: string, payload: { productId: string; uomId: string; sku: string; price: number }) => {
    const { data } = await api.put(`/api/variants/${id}`, payload);
    return data;
  },
  remove: async (id: string) => { await api.delete(`/api/variants/${id}`); },
};

// helpers for selects (uses the /all endpoints)
export const categoriesApiAll = {
  all: async () => {
    const { data } = await api.get<any[]>("/api/categories/all");
    return data;
  }
};


type Query = {
  search?: string;
  page?: number;        // 1-based
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
};

function qs(q: Query) {
  const p = new URLSearchParams();
  if (q.search) p.set('search', q.search);
  if (q.page) p.set('page', String(q.page));
  if (q.pageSize) p.set('pageSize', String(q.pageSize));
  if (q.sortBy) p.set('sortBy', q.sortBy);
  if (q.sortDir) p.set('sortDir', q.sortDir);
  return `?${p.toString()}`;
}

// export const categoriesApi = {
//   list: (q: Query) => api.get<PagedResponse<Category>>(`/api/catalog/categories${qs(q)}`),
//   create: (payload: Partial<Category>) => api.post<Category>(`/api/catalog/categories`, payload),
//   update: (id: string, payload: Partial<Category>) => api.put<Category>(`/api/catalog/categories/${id}`, payload),
//   remove: (id: string) => api.delete<void>(`/api/catalog/categories/${id}`),
// };

// export const uomsApi = {
//   list: (q: Query) => api.get<PagedResponse<Uom>>(`/api/catalog/uoms${qs(q)}`),
//   create: (payload: Partial<Uom>) => api.post<Uom>(`/api/catalog/uoms`, payload),
//   update: (id: string, payload: Partial<Uom>) => api.put<Uom>(`/api/catalog/uoms/${id}`, payload),
//   remove: (id: string) => api.delete<void>(`/api/catalog/uoms/${id}`),
// };

// export const productsApi = {
//   list: (q: Query) => api.get<PagedResponse<Product>>(`/api/catalog/products${qs(q)}`),
//   create: (payload: Partial<Product>) => api.post<Product>(`/api/catalog/products`, payload),
//   update: (id: string, payload: Partial<Product>) => api.put<Product>(`/api/catalog/products/${id}`, payload),
//   remove: (id: string) => api.delete<void>(`/api/catalog/products/${id}`),
// };

// export const variantsApi = {
//   list: (q: Query) => api.get<PagedResponse<Variant>>(`/api/catalog/variants${qs(q)}`),
//   create: (payload: Partial<Variant>) => api.post<Variant>(`/api/catalog/variants`, payload),
//   update: (id: string, payload: Partial<Variant>) => api.put<Variant>(`/api/catalog/variants/${id}`, payload),
//   remove: (id: string) => api.delete<void>(`/api/catalog/variants/${id}`),
// };
