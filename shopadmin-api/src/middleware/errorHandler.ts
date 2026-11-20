import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

// Error with an HTTP status code attached
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Route not found" });
}

// Central place where every error ends up
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }

  // Prisma: record not found (update or delete on a missing id)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return res.status(404).json({ error: "Product not found" });
  }

  // express.json(): malformed JSON body
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}