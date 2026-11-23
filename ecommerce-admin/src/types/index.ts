export type OrderStatus = "Delivered" | "Processing" | "Shipped" | "Cancelled";

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

export interface ApiValidationErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: ApiValidationErrorDetail[];
}

export interface SalesPoint {
  month: string;
  revenue: number;
  orders: number;
}
