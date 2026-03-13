import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../types/product";
import api from "../utils/api";
import { useProductsStore } from "../store/productsStore";

// Shape returned by dummyjson.com/products
interface DummyProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  stock: number;
  rating: number;
}

interface DummyProductsResponse {
  products: DummyProduct[];
}

async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<DummyProductsResponse>("/products?limit=30");
  return data.products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail,
    inStock: (p.stock ?? 0) % 3 !== 0,
    stockCount: (p.stock % 50) + 1,
    rating: { rate: p.rating, count: p.stock },
  }));
}

function useProducts() {
  const { setProducts, localProducts, products } = useProductsStore();

  const query = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Seed from API only when the store is empty (no local or persisted data)
  useEffect(() => {
    if (query.data && localProducts.length === 0 && products.length === 0) {
      setProducts(query.data);
    }
  }, [query.data, setProducts, localProducts.length, products.length]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export default useProducts;
