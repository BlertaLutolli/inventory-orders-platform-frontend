import api from "./http";
import { PagedResponse, Category, UnitOfMeasure, Product, Variant } from "../types/catalog";

/* CATEGORIES */
export const categoriesApi = {
  list: async (q: {
    search?: string; page?: number; pageSize?: number; sortBy?: string; sortDir?: "asc" | "desc";
  }) => {
    const { data } = await api.get<PagedResponse<Category>>("/api/categories", { params: q });
    return data;
  },
  all: async () => {
    const { data } = await api.get<Category[]>("/api/categories/all");
    return data;
  },
  create: async (payload: { name: string; code: string }) => {
    const { data } = await api.post<Category>("/api/categories", payload);
    return data;
  },
  update: async (id: string, payload: { name: string; code: string }) => {
    const { data } = await api.put<Category>(`/api/categories/${id}`, payload);
    return data;
  },
  remove: async (id: string) => { await api.delete(`/api/categories/${id}`); },
};

/* UOMS */
export const uomsApi = {
  list: async (q: { search?: string; page?: number; pageSize?: number; sortBy?: string; sortDir?: "asc" | "desc"; }) => {
    const { data } = await api.get<PagedResponse<UnitOfMeasure>>("/api/uoms", { params: q });
    return data;
  },
  all: async () => {
    const { data } = await api.get<UnitOfMeasure[]>("/api/uoms/all");
    return data;
  },
  create: async (payload: { name: string; code: string; precision?: number }) => {
    const { data } = await api.post<UnitOfMeasure>("/api/uoms", payload);
    return data;
  },
  update: async (id: string, payload: { name: string; code: string; precision?: number }) => {
    const { data } = await api.put<UnitOfMeasure>(`/api/uoms/${id}`, payload);
    return data;
  },
  remove: async (id: string) => { await api.delete(`/api/uoms/${id}`); },
};

/* PRODUCTS */
export const productsApi = {
  list: async (q: { search?: string; page?: number; pageSize?: number; sortBy?: string; sortDir?: "asc" | "desc"; }) => {
    const { data } = await api.get<PagedResponse<Product>>("/api/products", { params: q });
    return data;
  },
  all: async () => {
    const { data } = await api.get<Product[]>("/api/products/all");
    return data;
  },
  create: async (payload: { name: string; code: string; categoryId?: string }) => {
    const { data } = await api.post<Product>("/api/products", payload);
    return data;
  },
  update: async (id: string, payload: { name: string; code: string; categoryId?: string }) => {
    const { data } = await api.put<Product>(`/api/products/${id}`, payload);
    return data;
  },
  remove: async (id: string) => { await api.delete(`/api/products/${id}`); },
};

/* VARIANTS */
export const variantsApi = {
  list: async (q: { search?: string; page?: number; pageSize?: number; sortBy?: string; sortDir?: "asc" | "desc"; }) => {
    const { data } = await api.get<PagedResponse<Variant>>("/api/variants", { params: q });
    return data;
  },
  create: async (payload: { productId: string; uomId: string; sku: string; price: number }) => {
    const { data } = await api.post<Variant>("/api/variants", payload);
    return data;
  },
  update: async (id: string, payload: { productId: string; uomId: string; sku: string; price: number }) => {
    const { data } = await api.put<Variant>(`/api/variants/${id}`, payload);
    return data;
  },
  remove: async (id: string) => { await api.delete(`/api/variants/${id}`); },
};

export const categoriesApiAll = {
  all: async () => {
    const { data } = await api.get<Category[]>("/api/categories/all");
    return data;
  }
};
