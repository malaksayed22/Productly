import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Package, XCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useProductsStore } from "../store/productsStore";
import useLocalProducts from "../hooks/useLocalProducts";
import { useAdminStore } from "../store/adminStore";
import Layout from "../components/layout/Layout";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";

/** Renders up to 5 stars, filled proportionally to `rate` */
const StarRating = ({ rate, count }: { rate: number; count: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-0.5"
        aria-label={`Rating: ${rate} out of 5`}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rate >= i + 1;
          const half = !filled && rate > i && rate < i + 1;
          return (
            <svg
              key={i}
              className={["h-5 w-5", filled ? "" : half ? "" : ""].join(" ")}
              style={{
                color: filled ? "#facc15" : half ? "#fde68a" : "var(--border)",
              }}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.062 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.287-3.957z" />
            </svg>
          );
        })}
      </div>
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
        <span className="font-medium" style={{ color: "var(--text-primary)" }}>
          {rate}
        </span>{" "}
        ({count} {count === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const backTo =
    (location.state as { from?: string } | null)?.from ?? "/products";
  const [showConfirm, setShowConfirm] = useState(false);

  const allProducts = useProductsStore((s) => s.allProducts);
  const { deleteProduct } = useLocalProducts();
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

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    deleteProduct(product.id);
    logActivity({
      action: "DELETE_PRODUCT",
      label: `Deleted product "${product.title}"`,
      productId: product.id,
      productName: product.title,
    });
    if (preferences.showToasts.onDelete) toast.success("Product deleted");
    navigate(backTo);
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        {/* Main card */}
        <div
          className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl animate-scale-in"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* ── Left: Image ── */}
            <div
              className="flex items-center justify-center p-8 lg:w-2/5 lg:min-h-[480px]"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              <img
                src={product.image}
                alt={product.title}
                className="max-h-80 w-full rounded-xl object-contain lg:max-h-96"
              />
            </div>

            {/* ── Right: Details ── */}
            <div className="flex flex-1 flex-col gap-5 p-6 lg:p-10">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  {product.category}
                </span>
              </div>

              {/* Stock Status Block */}
              <div className="flex flex-col gap-2 py-3 border-y border-[var(--border)] my-3">
                {/* inStock badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.inStock
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>

                  {/* Low stock warning badge */}
                  {product.inStock &&
                    product.stockCount > 0 &&
                    product.stockCount <= 5 && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500">
                        Low Stock
                      </span>
                    )}
                </div>

                {/* Stock count line */}
                {product.inStock && product.stockCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Package
                      size={15}
                      className={
                        product.stockCount <= 5
                          ? "text-amber-500"
                          : "text-green-500"
                      }
                    />
                    <span
                      className={`text-sm font-medium ${
                        product.stockCount <= 5
                          ? "text-amber-500"
                          : "text-green-500"
                      }`}
                    >
                      {product.stockCount} left in stock
                    </span>

                    {/* Visual stock bar */}
                    <div className="flex-1 max-w-[100px] h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          product.stockCount <= 5
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min((product.stockCount / 50) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {product.inStock && product.stockCount === 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-500" />
                    <span className="text-sm text-amber-500">
                      Stock count not set
                    </span>
                  </div>
                )}

                {!product.inStock && (
                  <div className="flex items-center gap-2">
                    <XCircle size={15} className="text-red-500" />
                    <span className="text-sm text-red-500">
                      Currently unavailable
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1
                className="font-heading text-2xl font-bold leading-snug lg:text-3xl"
                style={{ color: "var(--text-primary)" }}
              >
                {product.title}
              </h1>

              {/* Price */}
              <p
                className="font-mono-price text-3xl font-extrabold"
                style={{ color: "var(--accent)" }}
              >
                ${product.price.toFixed(2)}
              </p>

              <hr style={{ borderColor: "var(--border)" }} />

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {product.description}
              </p>

              {/* Rating */}
              <StarRating
                rate={product.rating.rate}
                count={product.rating.count}
              />

              <hr style={{ borderColor: "var(--border)" }} />

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-1">
                {/* Back */}
                <button
                  onClick={() => navigate(backTo)}
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) =>
                    ((
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "var(--bg-tertiary)")
                  }
                  onMouseLeave={(e) =>
                    ((
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent")
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
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>

                {/* Edit */}
                <button
                  onClick={() =>
                    navigate(`/products/${product.id}/edit`, {
                      state: { from: backTo },
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) =>
                    ((
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "var(--bg-tertiary)")
                  }
                  onMouseLeave={(e) =>
                    ((
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent")
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
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>

                {/* Delete */}
                <button
                  onClick={() => setShowConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: "var(--c-danger)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.opacity =
                      "0.85")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
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
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete product?"
        message={`"${product.title}" will be permanently removed.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </Layout>
  );
};

export default ProductDetailPage;
