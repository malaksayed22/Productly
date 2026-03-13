import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { useAdminStore } from "../store/adminStore";
import ProductFilters from "../components/products/ProductFilters";
import ProductCard from "../components/products/ProductCard";
import Pagination from "../components/ui/Pagination";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";
import useProducts from "../hooks/useProducts";
import useLocalProducts from "../hooks/useLocalProducts";
import useProductFilters from "../hooks/useProductFilters";
import { useProductsStore } from "../store/productsStore";

const ProductsListPage = () => {
  const navigate = useNavigate();
  const { isLoading, isError, refetch } = useProducts();
  const { deleteProduct } = useLocalProducts();
  const allProducts = useProductsStore((s) => s.allProducts);
  const { logActivity, preferences } = useAdminStore();

  const {
    paginatedProducts,
    filteredProducts,
    totalPages,
    currentPage,
    setCurrentPage,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    stockFilter,
    setStockFilter,
  } = useProductFilters(allProducts);

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1
            className="font-heading text-3xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Products
          </h1>
          {!isLoading && !isError && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                backgroundColor: "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              {filteredProducts.length}
            </span>
          )}
        </div>

        <button
          onClick={() => navigate("/products/add")}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-heading font-semibold text-white transition-all duration-200 active:scale-95"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "var(--accent-hover)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "var(--accent)")
          }
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      {!isLoading && !isError && (
        <div className="mb-6">
          <ProductFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            categories={categories}
          />
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          <SkeletonCard count={6} />
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center animate-fade-up">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(239,68,68,0.12)" }}
          >
            <svg
              className="h-10 w-10"
              style={{ color: "var(--c-danger)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <div>
            <p
              className="font-heading text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Failed to load products
            </p>
            <p
              className="mt-1.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Something went wrong. Please try again.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 active:scale-95"
            style={{ backgroundColor: "var(--accent)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--accent-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--accent)")
            }
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filteredProducts.length === 0 && (
        <EmptyState
          title="No products found"
          message={
            searchQuery || selectedCategory || stockFilter !== "all"
              ? "Try adjusting your filters or search query."
              : "Get started by adding your first product."
          }
          actionLabel={
            searchQuery || selectedCategory || stockFilter !== "all"
              ? undefined
              : "Add Product"
          }
          onAction={
            searchQuery || selectedCategory || stockFilter !== "all"
              ? undefined
              : () => navigate("/products/add")
          }
        />
      )}

      {/* Product grid */}
      {!isLoading && !isError && paginatedProducts.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={deleteProduct}
                onDeleteLog={(name) => {
                  logActivity({
                    action: "DELETE_PRODUCT",
                    label: `Deleted product "${name}"`,
                    productName: name,
                  });
                  if (preferences.showToasts.onDelete)
                    toast.success("Product deleted");
                }}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </Layout>
  );
};

export default ProductsListPage;
