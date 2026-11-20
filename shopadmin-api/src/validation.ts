import { z } from "zod";
import { HttpError } from "./middleware/errorHandler";

// Used for both POST and PUT (PUT replaces the whole product)
export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(1000).default(""),
  price: z.coerce.number().positive("Price must be greater than 0").max(1_000_000),
  category: z.string().trim().min(1, "Category is required").max(60),
  stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative").default(0),
  imageUrl: z.string().trim().url("Image URL must be a valid URL"),
});

// Returns clean data or throws a 400 with a readable list of problems
export function parseProduct(body: unknown) {
  const result = productSchema.safeParse(body);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ field: i.path.join("."), message: i.message }));
    throw new HttpError(400, "Validation failed", details);
  }
  return result.data;
}

// Validates the :id route parameter
export function parseId(raw: string | string[] | undefined) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, "Product id must be a positive integer");
  }
  return id;
}