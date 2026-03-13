import type { Product } from "../types/product";
import { useProductsStore } from "../store/productsStore";

interface UseLocalProductsReturn {
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, data: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

function useLocalProducts(): UseLocalProductsReturn {
  const store = useProductsStore();

  const addProduct = (product: Omit<Product, "id">) => {
    store.addProduct(product);
  };

  const updateProduct = (id: number, data: Partial<Product>) => {
    store.updateProduct(id, data);
  };

  const deleteProduct = (id: number) => {
    store.deleteProduct(id);
  };

  return { addProduct, updateProduct, deleteProduct };
}

export default useLocalProducts;
