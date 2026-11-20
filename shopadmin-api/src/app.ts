import express from "express";
import cors from "cors";
import productRoutes from "./routes/products";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // the React dev server
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productRoutes);

// These two must stay last
app.use(notFound);
app.use(errorHandler);

export default app;