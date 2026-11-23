import type { Order, Product, SalesPoint } from "../types";

export const salesData: SalesPoint[] = [
  { month: "Dec", revenue: 31840, orders: 412 },
  { month: "Jan", revenue: 22470, orders: 318 },
  { month: "Feb", revenue: 20150, orders: 287 },
  { month: "Mar", revenue: 26930, orders: 356 },
  { month: "Apr", revenue: 24260, orders: 341 },
  { month: "May", revenue: 30115, orders: 402 },
  { month: "Jun", revenue: 27640, orders: 379 },
  { month: "Jul", revenue: 23980, orders: 331 },
  { month: "Aug", revenue: 27105, orders: 368 },
  { month: "Sep", revenue: 32720, orders: 425 },
  { month: "Oct", revenue: 35390, orders: 451 },
  { month: "Nov", revenue: 44860, orders: 538 },
];

// Percentage change between the last two months of a series
export function monthlyChange(values: number[]): number {
  if (values.length < 2) return 0;
  const prev = values[values.length - 2];
  const last = values[values.length - 1];
  return prev === 0 ? 0 : Number((((last - prev) / prev) * 100).toFixed(1));
}

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

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

export const products: Product[] = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 89.99, stock: 42, image: img("photo-1505740420928-5e560c06d30e"), imageUrl: img("photo-1505740420928-5e560c06d30e"), description: "Over-ear Bluetooth headphones with deep bass" },
  { id: 2, name: "Smart Watch Series 5", category: "Electronics", price: 199.0, stock: 8, image: img("photo-1523275335684-37898b6baf30"), imageUrl: img("photo-1523275335684-37898b6baf30"), description: "Fitness tracking and notifications on your wrist" },
  { id: 3, name: "Leather Backpack", category: "Fashion", price: 74.5, stock: 0, image: img("photo-1553062407-98eeb64c6a62"), imageUrl: img("photo-1553062407-98eeb64c6a62"), description: "Everyday carry genuine leather backpack" },
  { id: 4, name: "Running Shoes", category: "Fashion", price: 119.0, stock: 25, image: img("photo-1542291026-7eec264c27ff"), imageUrl: img("photo-1542291026-7eec264c27ff"), description: "Lightweight breathable road running shoes" },
  { id: 5, name: "Ceramic Coffee Mug", category: "Home", price: 14.99, stock: 120, image: img("photo-1514228742587-6b1558fcca3d"), imageUrl: img("photo-1514228742587-6b1558fcca3d"), description: "350ml handcrafted ceramic mug" },
  { id: 6, name: "Desk Lamp LED", category: "Home", price: 34.0, stock: 6, image: img("photo-1507473885765-e6ed057f782c"), imageUrl: img("photo-1507473885765-e6ed057f782c"), description: "Adjustable warm and cool LED desk lamp" },
  { id: 7, name: "Mechanical Keyboard", category: "Electronics", price: 129.0, stock: 0, image: img("photo-1511467687858-23d96c32e4ae"), imageUrl: img("photo-1511467687858-23d96c32e4ae"), description: "Hot-swappable tactile mechanical keyboard" },
  { id: 8, name: "Cotton T-Shirt", category: "Fashion", price: 19.99, stock: 76, image: img("photo-1521572163474-6864f9cf17ab"), imageUrl: img("photo-1521572163474-6864f9cf17ab"), description: "100% organic cotton classic crew neck" },
  { id: 9, name: "Bluetooth Speaker", category: "Electronics", price: 49.99, stock: 30, image: img("photo-1608043152269-423dbba4e7e1"), imageUrl: img("photo-1608043152269-423dbba4e7e1"), description: "Portable waterproof outdoor speaker" },
  { id: 10, name: "Yoga Mat", category: "Home", price: 24.5, stock: 15, image: img("photo-1544367567-0f2fcb009e0b"), imageUrl: img("photo-1544367567-0f2fcb009e0b"), description: "Non-slip eco-friendly 6mm exercise yoga mat" },
  { id: 11, name: "Noise-Cancelling Earbuds", category: "Electronics", price: 69.99, stock: 18, image: img("photo-1590658268037-6bf12165a8df"), imageUrl: img("photo-1590658268037-6bf12165a8df"), description: "True wireless earbuds with active noise cancellation" },
  { id: 12, name: "Minimalist Wall Clock", category: "Home", price: 29.0, stock: 5, image: img("photo-1563861826100-9cb868fdbe1c"), imageUrl: img("photo-1563861826100-9cb868fdbe1c"), description: "Silent sweeping quartz wall clock for modern spaces" },
  { id: 13, name: "Classic Denim Jacket", category: "Fashion", price: 89.0, stock: 14, image: img("photo-1576995853123-5a10305d93c0"), imageUrl: img("photo-1576995853123-5a10305d93c0"), description: "Vintage wash durable denim jacket" },
  { id: 14, name: "Ergonomic Wireless Mouse", category: "Electronics", price: 45.0, stock: 22, image: img("photo-1615663245857-ac93bb7c39e7"), imageUrl: img("photo-1615663245857-ac93bb7c39e7"), description: "Comfortable ergonomic grip with precision optical sensor" },
  { id: 15, name: "Stainless Water Bottle", category: "Home", price: 18.5, stock: 55, image: img("photo-1602143407151-7111542de6e8"), imageUrl: img("photo-1602143407151-7111542de6e8"), description: "Double-wall vacuum insulated 750ml flask" },
  { id: 16, name: "Polarized Sunglasses", category: "Fashion", price: 55.0, stock: 9, image: img("photo-1511499767150-a48a237f0083"), imageUrl: img("photo-1511499767150-a48a237f0083"), description: "UV400 protection lightweight frame sunglasses" },
  { id: 17, name: "Scented Soy Candle", category: "Home", price: 16.0, stock: 40, image: img("photo-1603006905003-be475563bc59"), imageUrl: img("photo-1603006905003-be475563bc59"), description: "Aromatherapy lavender and vanilla natural soy candle" },
  { id: 18, name: "Gaming Headset RGB", category: "Electronics", price: 95.0, stock: 11, image: img("photo-1599669454699-248893623440"), imageUrl: img("photo-1599669454699-248893623440"), description: "Surround sound headset with clear noise-cancelling mic" },
  { id: 19, name: "Classic Leather Wallet", category: "Fashion", price: 39.99, stock: 3, image: img("photo-1627123424574-724758594e93"), imageUrl: img("photo-1627123424574-724758594e93"), description: "Slim bifold wallet with RFID blocking layer" },
  { id: 20, name: "Stainless French Press", category: "Home", price: 32.0, stock: 19, image: img("photo-1517256064527-09c73fc73e38"), imageUrl: img("photo-1517256064527-09c73fc73e38"), description: "Heat-resistant glass and stainless steel coffee maker" },
];
