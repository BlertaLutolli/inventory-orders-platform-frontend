import { api } from '../api';
import { Category, Uom, Product, Variant, PagedResponse } from '../types/catalog';

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

export const categoriesApi = {
  list: (q: Query) => api.get<PagedResponse<Category>>(`/api/catalog/categories${qs(q)}`),
  create: (payload: Partial<Category>) => api.post<Category>(`/api/catalog/categories`, payload),
  update: (id: string, payload: Partial<Category>) => api.put<Category>(`/api/catalog/categories/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/api/catalog/categories/${id}`),
};

export const uomsApi = {
  list: (q: Query) => api.get<PagedResponse<Uom>>(`/api/catalog/uoms${qs(q)}`),
  create: (payload: Partial<Uom>) => api.post<Uom>(`/api/catalog/uoms`, payload),
  update: (id: string, payload: Partial<Uom>) => api.put<Uom>(`/api/catalog/uoms/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/api/catalog/uoms/${id}`),
};

export const productsApi = {
  list: (q: Query) => api.get<PagedResponse<Product>>(`/api/catalog/products${qs(q)}`),
  create: (payload: Partial<Product>) => api.post<Product>(`/api/catalog/products`, payload),
  update: (id: string, payload: Partial<Product>) => api.put<Product>(`/api/catalog/products/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/api/catalog/products/${id}`),
};

export const variantsApi = {
  list: (q: Query) => api.get<PagedResponse<Variant>>(`/api/catalog/variants${qs(q)}`),
  create: (payload: Partial<Variant>) => api.post<Variant>(`/api/catalog/variants`, payload),
  update: (id: string, payload: Partial<Variant>) => api.put<Variant>(`/api/catalog/variants/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/api/catalog/variants/${id}`),
};
