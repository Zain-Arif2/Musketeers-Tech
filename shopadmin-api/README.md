# ShopAdmin API

REST API for managing products in the ShopAdmin dashboard, built with Node.js, Express, TypeScript, PostgreSQL and Prisma.

## Tech Stack

- Node.js and Express 5
- TypeScript
- PostgreSQL (hosted on Neon)
- Prisma ORM (schema and migrations)
- Zod (request validation)
- Postman (API testing)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file from the example and add your DATABASE_URL
cp .env.example .env

# 3. Create the tables (runs the migration)
npx prisma migrate dev

# 4. Add 10 sample products
npm run db:seed

# 5. Start the server
npm run dev
```

The API runs on http://localhost:5000. Health check: http://localhost:5000/api/health

On Windows PowerShell, use `copy .env.example .env` instead of `cp`.

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (for example from Neon) |
| `PORT` | Server port, default 5000 |
| `CLIENT_URL` | Allowed frontend origin for CORS, default http://localhost:5173 |

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the server with auto-restart |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:seed` | Reset the table and insert 10 products |
| `npm run db:studio` | Open Prisma Studio to view the data |

## Product Model

| Field | Type | Notes |
|---|---|---|
| id | Int | Auto-increment primary key |
| name | String | Required |
| description | String | Optional, default empty |
| price | Decimal(10,2) | Must be greater than 0 |
| category | String | Required |
| stock | Int | Whole number, 0 or more |
| imageUrl | String | Must be a valid URL |
| createdAt | DateTime | Set automatically |
| updatedAt | DateTime | Updated automatically |

The Prisma schema is in `prisma/schema.prisma` and the migration is in `prisma/migrations/`.

## API Endpoints

| Method | URL | Description | Success |
|---|---|---|---|
| GET | `/api/products` | Get all products | 200 |
| GET | `/api/products/:id` | Get one product | 200 |
| POST | `/api/products` | Create a product | 201 |
| PUT | `/api/products/:id` | Update (replace) a product | 200 |
| DELETE | `/api/products/:id` | Delete a product | 204 |

### Query parameters for `GET /api/products`

- `category`: filter by category, for example `?category=Home` (`All` returns everything)
- `search`: case-insensitive search in name and description, for example `?search=bluetooth`

### Example request body (POST and PUT)

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "price": 29.99,
  "category": "Electronics",
  "stock": 50,
  "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
}
```

### Error responses

All errors use the same format: `{ "error": "message", "details": [...] }`

| Status | When |
|---|---|
| 400 | Validation failed (bad body) or invalid id such as `/products/abc` |
| 404 | Product not found, or route does not exist |
| 500 | Unexpected server error |

Example validation error:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "name", "message": "Name is required" },
    { "field": "price", "message": "Price must be greater than 0" }
  ]
}
```

## Validation and Error Handling

- Zod checks every request body before it reaches the database.
- The `:id` parameter must be a positive 32-bit integer.
- A central error handler turns errors into clean JSON responses with the right status code. Prisma's "record not found" error (P2025) becomes a 404.

## Testing with Postman

All endpoints were tested in Postman, including success cases and edge cases.

- Collection: [`postman/shopadmin-api.postman_collection.json`](./postman/shopadmin-api.postman_collection.json) (import it into Postman)
- Screenshots: [`screenshots/`](./screenshots)

| Test | Expected |
|---|---|
| Get all products | 200, array of 10 products |
| Get product by id | 200 |
| Get product not found (`/products/9999`) | 404 |
| Get invalid id (`/products/abc`) | 400 |
| Create product | 201 |
| Create product with empty name or negative price | 400 |
| Update product | 200 |
| Update product not found | 404 |
| Update product with invalid body | 400 |
| Delete product | 204 |
| Delete product not found | 404 |
| Get product after delete | 404 |

## Project Structure

```
shopadmin-api/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── db.ts
│   ├── validation.ts
│   ├── middleware/errorHandler.ts
│   └── routes/products.ts
├── postman/
├── screenshots/
├── prisma.config.ts
└── .env.example
```

## Author

Zain Arif ([@Zain-Arif2](https://github.com/Zain-Arif2))