# ShopAdmin API

REST API for managing products in the ShopAdmin dashboard, built with Node.js, Express, TypeScript, PostgreSQL and Prisma.

## Tech Stack
Node.js, Express 5, TypeScript, PostgreSQL (Neon), Prisma ORM, Zod

## Setup
```bash
npm install
cp .env.example .env     # then add your DATABASE_URL
npx prisma migrate dev
npm run db:seed
npm run dev
```
The API runs on http://localhost:5000

## Product Model
| Field | Type |
|---|---|
| id | Int (auto) |
| name | String |
| description | String |
| price | Decimal(10,2) |
| category | String |
| stock | Int |
| imageUrl | String |

## Endpoints
| Method | URL | Description | Success |
|---|---|---|---|
| GET | /api/products | Get all products (`?category=`, `?search=`) | 200 |
| GET | /api/products/:id | Get one product | 200 |
| POST | /api/products | Create a product | 201 |
| PUT | /api/products/:id | Update a product | 200 |
| DELETE | /api/products/:id | Delete a product | 204 |

Errors: `400` validation failed, `404` product not found, `500` server error.

## Validation
Zod checks every request body: name and category required, price greater than 0, stock a whole number of 0 or more, imageUrl a valid URL.

## Testing
All endpoints were tested with Postman. See `postman/` for the collection and `screenshots/` for the results.

## Author
Zain Arif