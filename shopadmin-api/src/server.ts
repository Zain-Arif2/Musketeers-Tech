import "dotenv/config";
import app from "./app";
import { prisma } from "./db";

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

// Close the database connection when the server stops gracefully
const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);