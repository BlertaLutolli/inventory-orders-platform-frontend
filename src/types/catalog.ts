export type Category = {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt?: string;
};

export type Uom = {
  id: string;
  name: string;   // e.g., "Kilogram"
  code: string;   // e.g., "kg"
  createdAt: string;
  updatedAt?: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;           // must be unique per tenant
  categoryId: string;
  uomId: string;
  createdAt: string;
  updatedAt?: string;
};

export type Variant = {
  id: string;
  productId: string;
  name: string;
  sku: string;           // unique per tenant
  createdAt: string;
  updatedAt?: string;
};

export type PagedResponse<T> = {
  items: T[];
  total: number;
};
