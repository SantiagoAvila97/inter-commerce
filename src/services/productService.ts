import type { Product, ProductsResponse, ProductCategoriesResponse } from '@/types';
import { apiRequest } from './httpClient';

export interface GetProductsOptions {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
}

export async function getProducts(options: GetProductsOptions): Promise<ProductsResponse> {
  const { limit, skip, q, category } = options;

  if (q && q.trim().length > 0) {
    return apiRequest<ProductsResponse>('/products/search', {
      params: { q: q.trim(), limit, skip },
    });
  }

  if (category && category.trim().length > 0) {
    return apiRequest<ProductsResponse>(`/products/category/${encodeURIComponent(category)}`, {
      params: { limit, skip },
    });
  }

  return apiRequest<ProductsResponse>('/products', {
    params: { limit, skip },
  });
}

export async function getProductById(id: number): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`);
}

export async function getCategories(): Promise<string[]> {
  const response = await apiRequest<ProductCategoriesResponse>('/products/categories');
  return response.map((category) => category.slug);
}

export const productService = {
  getProducts,
  getProductById,
  getCategories,
};
