import { Router } from "express";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Product } from "@prisma/client";
import { prisma } from "../db";
import { HttpError } from "../middleware/errorHandler";
import { parseId, parseProduct } from "../validation";

const router = Router();

// Passes async errors to the error handler
const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };

// Prisma returns Decimal for price, so convert it to a normal number for JSON
const toDto = (p: Product) => ({ ...p, price: Number(p.price) });

// GET /api/products  (optional filters: ?category=Home&search=mug)
router.get(
  "/",
  wrap(async (req, res) => {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const products = await prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(search && { name: { contains: search, mode: "insensitive" } }),
      },
      orderBy: { id: "asc" },
    });
    res.json(products.map(toDto));
  })
);

// GET /api/products/:id
router.get(
  "/:id",
  wrap(async (req, res) => {
    const id = parseId(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new HttpError(404, "Product not found");
    res.json(toDto(product));
  })
);

// POST /api/products
router.post(
  "/",
  wrap(async (req, res) => {
    const data = parseProduct(req.body);
    const product = await prisma.product.create({ data });
    res.status(201).json(toDto(product));
  })
);

// PUT /api/products/:id
router.put(
  "/:id",
  wrap(async (req, res) => {
    const id = parseId(req.params.id);
    const data = parseProduct(req.body);
    const product = await prisma.product.update({ where: { id }, data });
    res.json(toDto(product));
  })
);

// DELETE /api/products/:id
router.delete(
  "/:id",
  wrap(async (req, res) => {
    const id = parseId(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  })
);

export default router;