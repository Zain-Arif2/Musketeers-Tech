# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
# ShopAdmin: E-commerce Admin Dashboard

A modern, responsive admin dashboard for an e-commerce store, built with React, TypeScript and Tailwind CSS. It uses mock data only (no backend), and focuses on UI/UX and basic working interactions.

**Live demo:** <your-vercel-link>

## Screenshots

| Desktop (light) | Desktop (dark) | Mobile |
| --- | --- | --- |
| ![Dashboard](./screenshots/dashboard-light.png) | ![Dashboard dark](./screenshots/dashboard-dark.png) | ![Mobile](./screenshots/mobile.png) |

<!-- Create a "screenshots" folder inside the project and add your images with these names -->

## Features

- **Dashboard overview:** revenue, orders, product count and stock alerts, all calculated from the mock data, with month-over-month change and sparklines
- **Sales analytics chart:** switch between revenue and orders, 6M / 12M range, highlighted best month, average order value and a tooltip showing both metrics
- **Recent orders:** search by customer or order ID, filter by status; table on desktop and card list on mobile
- **Products:** product cards with image, price and stock status (in stock, low stock, out of stock), search, category filter and delete
- **Sidebar navigation:** fixed on desktop, slide-in drawer on mobile
- **Dark / light theme:** saved in `localStorage`, defaults to the system preference
- **Loading skeletons:** simulate async data fetching
- **Responsive design:** tested from 320px mobile up to desktop

## Tech Stack

- React 19 (Vite) and TypeScript
- Tailwind CSS v4
- React Router
- Recharts
- lucide-react (icons)

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Zain-Arif2/Musketeers-Tech.git
cd Musketeers-Tech/ecommerce-admin

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser.

To create a production build:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/   # Layout, Sidebar, Header, StatCard, SalesChart, RecentOrders, ProductList
├── pages/        # Dashboard, Products, Orders
├── hooks/        # useTheme, useFakeLoading
├── data/         # mock.ts (sales, orders, products)
└── types/        # shared TypeScript interfaces
```

## Implementation Notes

- **Mock data:** all numbers shown on the dashboard are derived from `src/data/mock.ts` (nothing is hardcoded in the UI). To connect a real API later, replace the mock imports with fetch calls and keep the same TypeScript interfaces.
- **Derived state:** filtered lists (orders and products) are calculated from the source data and the filter inputs on each render, instead of being stored in separate state.
- **Routing:** a shared `Layout` component renders the sidebar and header, and React Router's `Outlet` renders the active page.
- **Dark mode:** a `useTheme` hook toggles the `dark` class on `<html>`, which activates Tailwind's `dark:` variants.
- **Responsive orders:** the orders list switches between a table (desktop) and cards (mobile) with Tailwind breakpoints.

## Possible Improvements

- "Add product" modal with form validation
- Functional global search in the header
- Pagination for orders and products
- Real API integration (for example with React Query)
- Unit tests for filtering logic

## Author

Zain Arif ([@Zain-Arif2](https://github.com/Zain-Arif2))