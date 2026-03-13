import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import ProductForm from "../components/products/ProductForm";
import useLocalProducts from "../hooks/useLocalProducts";
import { useAdminStore } from "../store/adminStore";
import type { ProductFormData } from "../utils/validators";

const AddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct } = useLocalProducts();
  const { logActivity, preferences } = useAdminStore();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: ProductFormData) => {
    const newProduct = {
      title: data.title,
      price: data.price,
      category: data.category,
      description: data.description,
      image: data.image,
      inStock: data.inStock,
      stockCount: data.inStock ? (data.stockCount ?? 0) : 0,
      rating: { rate: 0, count: 0 },
    };

    addProduct(newProduct);

    logActivity({
      action: "ADD_PRODUCT",
      label: `Added "${data.title}" — ${
        data.inStock ? `${data.stockCount} in stock` : "Out of stock"
      }`,
      productName: data.title,
      stockCount: data.stockCount ?? 0,
    });

    toast.success(`"${data.title}" added successfully!`);
    navigate("/products");
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
            Add New Product
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Fill in the details below to add a new product to the catalogue.
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
          <ProductForm mode="add" onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
};

export default AddProductPage;
