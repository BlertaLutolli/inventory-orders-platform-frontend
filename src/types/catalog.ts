// src/types/catalog.ts

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Category {
  id: string;
  name: string;
  code: string;
  createdAt: string; // ISO
}

export interface UnitOfMeasure {
  id: string;
  name: string;
  code: string;
  precision?: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;            // required by ProductsForm/ProductsPage
  categoryId?: string;
  categoryName?: string;   // optional for table column
  createdAt: string;
}

export interface Variant {
  id: string;
  productId: string;
  productName?: string;    // optional for table column
  uomId: string;
  uomName?: string;        // optional for table column
  sku: string;
  price: number;           // required by VariantsForm/VariantsPage
  createdAt: string;
}
