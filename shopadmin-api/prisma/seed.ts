import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      { name: "Wireless Headphones", description: "Over-ear Bluetooth headphones", price: 89.99, category: "Electronics", stock: 42, imageUrl: img("photo-1505740420928-5e560c06d30e") },
      { name: "Smart Watch Series 5", description: "Fitness and notifications on your wrist", price: 199, category: "Electronics", stock: 8, imageUrl: img("photo-1523275335684-37898b6baf30") },
      { name: "Leather Backpack", description: "Everyday carry backpack", price: 74.5, category: "Fashion", stock: 0, imageUrl: img("photo-1553062407-98eeb64c6a62") },
      { name: "Running Shoes", description: "Lightweight road running shoes", price: 119, category: "Fashion", stock: 25, imageUrl: img("photo-1542291026-7eec264c27ff") },
      { name: "Ceramic Coffee Mug", description: "350ml ceramic mug", price: 14.99, category: "Home", stock: 120, imageUrl: img("photo-1514228742587-6b1558fcca3d") },
      { name: "Desk Lamp LED", description: "Adjustable LED desk lamp", price: 34, category: "Home", stock: 6, imageUrl: img("photo-1507473885765-e6ed057f782c") },
      { name: "Mechanical Keyboard", description: "Hot-swappable mechanical keyboard", price: 129, category: "Electronics", stock: 0, imageUrl: img("photo-1511467687858-23d96c32e4ae") },
      { name: "Cotton T-Shirt", description: "100% cotton crew neck", price: 19.99, category: "Fashion", stock: 76, imageUrl: img("photo-1521572163474-6864f9cf17ab") },
    ],
  });
  console.log("Seeded 8 products");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());