# Products Dashboard

A responsive product management SPA built with **Vite + React + TypeScript**. It fetches products from the [Fake Store API](https://fakestoreapi.com), lets you browse, search, filter, add, edit, and delete products — with all local changes persisted in a Zustand store for the session.

---

## Tech Stack

| Layer         | Library                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Build tool    | [Vite](https://vitejs.dev)                                                                        |
| UI framework  | [React 18](https://react.dev)                                                                     |
| Language      | TypeScript                                                                                        |
| Routing       | [React Router v6](https://reactrouter.com)                                                        |
| Server state  | [TanStack Query v5](https://tanstack.com/query)                                                   |
| Client state  | [Zustand](https://zustand-demo.pmnd.rs)                                                           |
| HTTP client   | [Axios](https://axios-http.com)                                                                   |
| Forms         | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) via `@hookform/resolvers` |
| Styling       | [Tailwind CSS v3](https://tailwindcss.com) (dark mode via `class` strategy)                       |
| Notifications | [react-hot-toast](https://react-hot-toast.com)                                                    |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
# 1. Navigate into the project
cd products-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

```bash
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint
```

---

## Features

- **Product list** — responsive 1/2/3-column grid with skeleton loading state
- **Search** — debounced (400 ms) full-text search across title & description
- **Filters** — category dropdown + stock status toggle (All / In Stock / Out of Stock)
- **Pagination** — 10 products per page with smart ellipsis navigation
- **Product detail** — full-page view with star rating, image, and action buttons
- **Add product** — validated form with live image URL preview
- **Edit product** — pre-filled form, saves as a local override on top of API data
- **Delete product** — confirmation dialog before removal, toast on success
- **Dark mode** — one-click toggle, preference persisted in `localStorage`
- **Error handling** — per-route error boundaries + 404 catch-all page

---

## Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx               # Page shell: Navbar + centred main content
│   │   └── Navbar.tsx               # Logo, dark-mode toggle, Add Product button
│   ├── products/
│   │   ├── ProductCard.tsx          # Grid card with edit/delete actions
│   │   ├── ProductFilters.tsx       # Search input, category dropdown, stock toggle
│   │   └── ProductForm.tsx          # Shared add/edit form (React Hook Form + Zod)
│   └── ui/
│       ├── Badge.tsx                # Pill badge (success/danger/warning/info)
│       ├── Button.tsx               # Button with variants (primary/secondary/danger/ghost)
│       ├── ConfirmDialog.tsx        # Modal confirmation dialog
│       ├── EmptyState.tsx           # Centred empty / not-found state with optional CTA
│       ├── Pagination.tsx           # Page-number navigator with ellipsis
│       ├── RouterErrorBoundary.tsx  # React Router v6 errorElement component
│       ├── SkeletonCard.tsx         # Animated pulse skeleton matching ProductCard
│       └── Spinner.tsx              # Standalone loading spinner (sm/md/lg)
├── hooks/
│   ├── useDebounce.ts               # Generic debounce<T>(value, delay) hook
│   ├── useLocalProducts.ts          # addProduct / updateProduct / deleteProduct
│   ├── useProductFilters.ts         # Search, filter, pagination state + logic
│   └── useProducts.ts               # TanStack Query fetch + Zustand store seeding
├── pages/
│   ├── AddProductPage.tsx
│   ├── EditProductPage.tsx
│   ├── ProductDetailPage.tsx
│   └── ProductsListPage.tsx
├── router/
│   └── index.tsx                    # createBrowserRouter, errorElement on every route
├── store/
│   └── productsStore.ts             # Zustand store: API products + local overrides merged
├── types/
│   └── product.ts                   # Product & Rating TypeScript interfaces
└── utils/
    ├── api.ts                       # Axios instance (baseURL = https://fakestoreapi.com)
    └── validators.ts                # Zod ProductFormSchema + inferred ProductFormValues
```

---

## Data Flow

```
https://fakestoreapi.com/products
           │
    useProducts (TanStack Query)
           │  on success, only if store is empty
           ▼
  productsStore.products[]        ← API data (baseline)
           │
           │  merge(products, localProducts)
           ▼
  productsStore.allProducts[]     ← What the UI reads and renders
           ▲
  productsStore.localProducts[]   ← Session mutations (add / edit / delete)
```

Local mutations are session-only; a full page refresh re-fetches from the API and re-applies any locally cached overrides stored in `localProducts`.

---

## Dark Mode

The Navbar toggle button:

1. Flips the `dark` class on `<html>` — required by Tailwind's `darkMode: 'class'` config
2. Writes the user preference (`"dark"` / `"light"`) to `localStorage` under the key `theme`
3. On mount, reads `localStorage` first, then falls back to the OS `prefers-color-scheme` media query
