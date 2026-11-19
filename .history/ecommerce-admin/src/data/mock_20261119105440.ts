import type { Order, Product, SalesPoint } from "../types";

export const salesData: SalesPoint[] = [
  { month: "Dec", revenue: 12400, orders: 210 },
  { month: "Jan", revenue: 15800, orders: 260 },
  { month: "Feb", revenue: 14200, orders: 240 },
  { month: "Mar", revenue: 18900, orders: 310 },
  { month: "Apr", revenue: 17300, orders: 290 },
  { month: "May", revenue: 21500, orders: 355 },
  { month: "Jun", revenue: 20100, orders: 340 },
  { month: "Jul", revenue: 24800, orders: 410 },
  { month: "Aug", revenue: 23200, orders: 385 },
  { month: "Sep", revenue: 27600, orders: 450 },
  { month: "Oct", revenue: 29900, orders: 490 },
  { month: "Nov", revenue: 33400, orders: 540 },
];

export const orders: Order[] = [
  { id: "#ORD-1042", customer: "Ayesha Khan", date: "2026-11-17", total: 189.5, status: "Processing" },
  { id: "#ORD-1041", customer: "Ali Raza", date: "2026-11-17", total: 74.0, status: "Shipped" },
  { id: "#ORD-1040", customer: "Sara Ahmed", date: "2026-11-16", total: 320.99, status: "Delivered" },
  { id: "#ORD-1039", customer: "Usman Tariq", date: "2026-11-16", total: 45.25, status: "Cancelled" },
  { id: "#ORD-1038", customer: "Hina Malik", date: "2026-11-15", total: 129.0, status: "Delivered" },
  { id: "#ORD-1037", customer: "Bilal Hussain", date: "2026-11-15", total: 210.0, status: "Processing" },
  { id: "#ORD-1036", customer: "Fatima Noor", date: "2026-11-14", total: 88.75, status: "Shipped" },
  { id: "#ORD-1035", customer: "Hamza Sheikh", date: "2026-11-14", total: 59.99, status: "Delivered" },
];

export const products: Product[] = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 89.99, stock: 42, image: "https://placehold.co/300x300?text=Headphones" },
  { id: 2, name: "Smart Watch Series 5", category: "Electronics", price: 199.0, stock: 8, image: "https://placehold.co/300x300?text=Smart+Watch" },
  { id: 3, name: "Leather Backpack", category: "Fashion", price: 74.5, stock: 0, image: "https://placehold.co/300x300?text=Backpack" },
  { id: 4, name: "Running Shoes", category: "Fashion", price: 119.0, stock: 25, image: "https://placehold.co/300x300?text=Shoes" },
  { id: 5, name: "Ceramic Coffee Mug", category: "Home", price: 14.99, stock: 120, image: "https://placehold.co/300x300?text=Coffee+Mug" },
  { id: 6, name: "Desk Lamp LED", category: "Home", price: 34.0, stock: 6, image: "https://placehold.co/300x300?text=Desk+Lamp" },
  { id: 7, name: "Mechanical Keyboard", category: "Electronics", price: 129.0, stock: 0, image: "https://placehold.co/300x300?text=Keyboard" },
  { id: 8, name: "Cotton T-Shirt", category: "Fashion", price: 19.99, stock: 76, image: "https://placehold.co/300x300?text=T-Shirt" },
];