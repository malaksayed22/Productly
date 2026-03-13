import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product } from "../types/product";
import useDebounce from "./useDebounce";

type StockFilter = "all" | "inStock" | "outOfStock";

const PAGE_SIZE = 10;

interface UseProductFiltersReturn {
  /** Products after search + category + stock filters */
  filteredProducts: Product[];
  /** Current page slice of filteredProducts */
  paginatedProducts: Product[];
  totalPages: number;
  /** Unique category strings derived from the input list */
  categories: string[];

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  selectedCategory: string;
  setSelectedCategory: (c: string) => void;

  stockFilter: StockFilter;
  setStockFilter: (f: StockFilter) => void;

  currentPage: number;
  setCurrentPage: (p: number) => void;
}

function useProductFilters(products: Product[]): UseProductFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? "";
  const stockFilter = (searchParams.get("stock") as StockFilter) ?? "all";
  const currentPage = Number(searchParams.get("page") ?? "1");

  const updateParams = (updates: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, val]) => {
        if (val === "" || val === "all" || val === "1") {
          next.delete(key);
        } else {
          next.set(key, val);
        }
      });
      return next;
    });
  };

  const setSearchQuery = (q: string) => updateParams({ q, page: "1" });

  const setSelectedCategory = (c: string) =>
    updateParams({ category: c, page: "1" });

  const setStockFilter = (f: StockFilter) =>
    updateParams({ stock: f, page: "1" });

  const setCurrentPage = (p: number) => updateParams({ page: String(p) });

  const debouncedSearch = useDebounce(searchQuery, 400);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return products.filter((p) => {
      if (
        term &&
        !p.title.toLowerCase().includes(term) &&
        !p.description.toLowerCase().includes(term)
      ) {
        return false;
      }

      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }

      if (stockFilter === "inStock" && !(p.inStock && p.stockCount > 0))
        return false;
      if (stockFilter === "outOfStock" && p.inStock && p.stockCount > 0)
        return false;

      return true;
    });
  }, [products, debouncedSearch, selectedCategory, stockFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, safePage]);

  return {
    filteredProducts,
    paginatedProducts,
    totalPages,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    stockFilter,
    setStockFilter,
    currentPage: safePage,
    setCurrentPage,
  };
}

export default useProductFilters;
