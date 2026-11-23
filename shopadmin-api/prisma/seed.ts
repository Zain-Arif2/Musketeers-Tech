import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

async function main() {
  // Delete all rows and restart ids from 1
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "products" RESTART IDENTITY`);

  await prisma.product.createMany({
    data: [
      { name: "Wireless Headphones", description: "Over-ear Bluetooth headphones with deep bass", price: 89.99, category: "Electronics", stock: 42, imageUrl: img("photo-1505740420928-5e560c06d30e") },
      { name: "Smart Watch Series 5", description: "Fitness tracking and notifications on your wrist", price: 199, category: "Electronics", stock: 8, imageUrl: img("photo-1523275335684-37898b6baf30") },
      { name: "Leather Backpack", description: "Everyday carry genuine leather backpack", price: 74.5, category: "Fashion", stock: 0, imageUrl: img("photo-1553062407-98eeb64c6a62") },
      { name: "Running Shoes", description: "Lightweight breathable road running shoes", price: 119, category: "Fashion", stock: 25, imageUrl: img("photo-1542291026-7eec264c27ff") },
      { name: "Ceramic Coffee Mug", description: "350ml handcrafted ceramic mug", price: 14.99, category: "Home", stock: 120, imageUrl: img("photo-1514228742587-6b1558fcca3d") },
      { name: "Desk Lamp LED", description: "Adjustable warm and cool LED desk lamp", price: 34, category: "Home", stock: 6, imageUrl: img("photo-1507473885765-e6ed057f782c") },
      { name: "Mechanical Keyboard", description: "Hot-swappable tactile mechanical keyboard", price: 129, category: "Electronics", stock: 0, imageUrl: img("photo-1511467687858-23d96c32e4ae") },
      { name: "Cotton T-Shirt", description: "100% organic cotton classic crew neck", price: 19.99, category: "Fashion", stock: 76, imageUrl: img("photo-1521572163474-6864f9cf17ab") },
      { name: "Bluetooth Speaker", description: "Portable waterproof outdoor speaker", price: 49.99, category: "Electronics", stock: 30, imageUrl: img("photo-1608043152269-423dbba4e7e1") },
      { name: "Yoga Mat", description: "Non-slip eco-friendly 6mm exercise yoga mat", price: 24.5, category: "Home", stock: 15, imageUrl: img("photo-1544367567-0f2fcb009e0b") },
      { name: "Noise-Cancelling Earbuds", description: "True wireless earbuds with active noise cancellation", price: 69.99, category: "Electronics", stock: 18, imageUrl: img("photo-1590658268037-6bf12165a8df") },
      { name: "Minimalist Wall Clock", description: "Silent sweeping quartz wall clock for modern spaces", price: 29.0, category: "Home", stock: 5, imageUrl: img("photo-1563861826100-9cb868fdbe1c") },
      { name: "Classic Denim Jacket", description: "Vintage wash durable denim jacket", price: 89.0, category: "Fashion", stock: 14, imageUrl: img("photo-1576995853123-5a10305d93c0") },
      { name: "Ergonomic Wireless Mouse", description: "Comfortable ergonomic grip with precision optical sensor", price: 45.0, category: "Electronics", stock: 22, imageUrl: img("photo-1615663245857-ac93bb7c39e7") },
      { name: "Stainless Water Bottle", description: "Double-wall vacuum insulated 750ml flask", price: 18.5, category: "Home", stock: 55, imageUrl: img("photo-1602143407151-7111542de6e8") },
      { name: "Polarized Sunglasses", description: "UV400 protection lightweight frame sunglasses", price: 55.0, category: "Fashion", stock: 9, imageUrl: img("photo-1511499767150-a48a237f0083") },
      { name: "Scented Soy Candle", description: "Aromatherapy lavender and vanilla natural soy candle", price: 16.0, category: "Home", stock: 40, imageUrl: img("photo-1603006905003-be475563bc59") },
      { name: "Gaming Headset RGB", description: "Surround sound headset with clear noise-cancelling mic", price: 95.0, category: "Electronics", stock: 11, imageUrl: img("photo-1599669454699-248893623440") },
      { name: "Classic Leather Wallet", description: "Slim bifold wallet with RFID blocking layer", price: 39.99, category: "Fashion", stock: 3, imageUrl: img("photo-1627123424574-724758594e93") },
      { name: "Stainless French Press", description: "Heat-resistant glass and stainless steel coffee maker", price: 32.0, category: "Home", stock: 19, imageUrl: img("photo-1517256064527-09c73fc73e38") },
    ],
  });
  console.log("Seeded 20 products successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
