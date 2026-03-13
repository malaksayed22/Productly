import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";

interface ProductsState {
  /** Products fetched from the API */
  products: Product[];
  /** Products created/modified locally */
  localProducts: Product[];
  /** IDs of API products that were deleted */
  deletedIds: number[];
  /** Merged view: localProducts override API products by id */
  allProducts: Product[];
  /** Replace the API products list */
  setProducts: (products: Product[]) => void;
  /** Add a brand-new local product */
  addProduct: (product: Omit<Product, "id">) => void;
  /** Update an existing product (creates a local override if needed) */
  updateProduct: (id: number, data: Partial<Product>) => void;
  /** Remove a product by id from both lists */
  deleteProduct: (id: number) => void;
  /** Reset all local overrides/additions and deleted-id list */
  clearLocalProducts: () => void;
}

function merge(
  products: Product[],
  localProducts: Product[],
  deletedIds: number[],
): Product[] {
  const deletedSet = new Set(deletedIds);
  const localMap = new Map(localProducts.map((p) => [p.id, p]));
  const merged = products
    .filter((p) => !deletedSet.has(p.id))
    .map((p) => localMap.get(p.id) ?? p);
  // Append purely local products (those with ids not in API list)
  const apiIds = new Set(products.map((p) => p.id));
  const addedLocally = localProducts.filter(
    (p) => !apiIds.has(p.id) && !deletedSet.has(p.id),
  );
  return [...merged, ...addedLocally];
}

/** Ensures inStock is always false when stockCount is 0 */
function normalizeStock(p: Product): Product {
  const stockCount = p.stockCount ?? 0;
  return stockCount === 0
    ? { ...p, stockCount, inStock: false }
    : { ...p, stockCount };
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      localProducts: [],
      deletedIds: [],
      allProducts: [],

      setProducts: (products) => {
        const { localProducts, deletedIds } = get();
        set({
          products,
          allProducts: merge(products, localProducts, deletedIds),
        });
      },

      addProduct: (product) => {
        const { products, deletedIds } = get();
        const newProduct: Product = {
          ...product,
          id: Date.now(),
          inStock: product.inStock,
          stockCount: product.stockCount ?? 0,
          rating: product.rating ?? { rate: 0, count: 0 },
        };
        const normalized = normalizeStock(newProduct);
        const localProducts = [...get().localProducts, normalized];
        set({
          localProducts,
          allProducts: merge(products, localProducts, deletedIds),
        });
      },

      updateProduct: (id, data) => {
        set((state) => {
          const localProducts = state.localProducts.map((p) =>
            p.id === id ? { ...p, ...data } : p,
          );
          const products = state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p,
          );
          return {
            localProducts,
            products,
            allProducts: merge(products, localProducts, state.deletedIds),
          };
        });
      },

      deleteProduct: (id) => {
        const { products } = get();
        const localProducts = get().localProducts.filter((p) => p.id !== id);
        const deletedIds = [...get().deletedIds, id];
        set({
          localProducts,
          deletedIds,
          allProducts: merge(products, localProducts, deletedIds),
        });
      },

      clearLocalProducts: () => {
        const { products } = get();
        set({
          localProducts: [],
          deletedIds: [],
          allProducts: merge(products, [], []),
        });
      },
    }),
    {
      name: "products-store",
      // Persist API cache + mutation data so everything survives logout/close
      partialize: (state) => ({
        products: state.products,
        localProducts: state.localProducts,
        deletedIds: state.deletedIds,
      }),
      // Recompute the derived allProducts after the store is hydrated from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.localProducts = state.localProducts.map(normalizeStock);
          state.allProducts = merge(
            state.products,
            state.localProducts,
            state.deletedIds,
          );
        }
      },
    },
  ),
);
