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
  category: string;
  price: number;
  stock: number;
  image: string;
}

export interface SalesPoint {
  month: string;
  revenue: number;
  orders: number;
}