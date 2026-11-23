import { apiClient } from "./client";
import type { Product, ProductInput } from "../types";

export interface GetProductsParams {
  category?: string;
  search?: string;
}

export const productsApi = {
  /**
   * Fetch all products, optionally filtered by category and search
   */
  async getAll(params?: GetProductsParams): Promise<Product[]> {
    return apiClient<Product[]>("products", {
      method: "GET",
      params: {
        category: params?.category,
        search: params?.search,
      },
    });
  },

  /**
   * Fetch a single product by its ID
   */
  async getById(id: number): Promise<Product> {
    return apiClient<Product>(`products/${id}`, {
      method: "GET",
    });
  },

  /**
   * Create a new product
   */
  async create(data: ProductInput): Promise<Product> {
    return apiClient<Product>("products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing product by ID
   */
  async update(id: number, data: ProductInput): Promise<Product> {
    return apiClient<Product>(`products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a product by ID
   */
  async delete(id: number): Promise<void> {
    return apiClient<void>(`products/${id}`, {
      method: "DELETE",
    });
  },
};

