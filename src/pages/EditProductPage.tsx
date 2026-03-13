import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductsStore } from "../store/productsStore";
import useLocalProducts from "../hooks/useLocalProducts";
import { useAdminStore } from "../store/adminStore";
import Layout from "../components/layout/Layout";
import ProductForm from "../components/products/ProductForm";
import EmptyState from "../components/ui/EmptyState";
import type { ProductFormData } from "../utils/validators";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const backTo =
    (location.state as { from?: string } | null)?.from ?? "/products";
  const [isLoading, setIsLoading] = useState(false);

  const allProducts = useProductsStore((s) => s.allProducts);
  const { updateProduct } = useLocalProducts();
  const { logActivity, preferences } = useAdminStore();

  const product = allProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <Layout>
        <EmptyState
          title="Product not found"
          message="This product doesn't exist or may have been deleted."
          actionLabel="Back to Products"
          onAction={() => navigate("/products")}
        />
      </Layout>
    );
  }

  const onSubmit = (data: ProductFormData) => {
    const updatedFields = {
      title: data.title,
      price: data.price,
      category: data.category,
      description: data.description,
      image: data.image,
      inStock: data.inStock,
      stockCount: data.inStock ? (data.stockCount ?? 0) : 0,
    };

    updateProduct(product.id, updatedFields);

    logActivity({
      action: "EDIT_PRODUCT",
      label: `Edited "${data.title}" — ${
        data.inStock ? `${data.stockCount} in stock` : "Out of stock"
      }`,
      productId: product.id,
      productName: data.title,
      stockCount: data.stockCount ?? 0,
    });

    toast.success(`"${data.title}" updated successfully!`);
    navigate(`/products/${product.id}`);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div
          className="mb-8 border-l-4 pl-4"
          style={{ borderColor: "var(--accent)" }}
        >
          <h1
            className="font-heading text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Edit Product
          </h1>
          <p
            className="mt-1 text-sm line-clamp-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {product.title}
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <ProductForm
            mode="edit"
            defaultValues={{
              title: product.title,
              price: product.price,
              category: product.category,
              description: product.description,
              image: product.image,
              inStock: product.inStock,
              stockCount: product.stockCount ?? 0,
            }}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditProductPage;
