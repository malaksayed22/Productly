import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import ConfirmDialog from "../ui/ConfirmDialog";

export interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
  onDeleteLog?: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onDelete,
  onDeleteLog,
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCardClick = () =>
    navigate(`/products/${product.id}`, { state: { from: "/products" } });
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.id}/edit`, { state: { from: "/products" } });
  };
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };
  const handleConfirmDelete = () => {
    setShowConfirm(false);
    onDelete(product.id);
    onDeleteLog?.(product.title);
  };

  return (
    <>
      <article
        onClick={handleCardClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer transition-all duration-300"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: hovered
            ? "1px solid var(--accent)"
            : "1px solid var(--border)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        {/* Image container */}
        <div
          className="relative h-[220px] w-full overflow-hidden"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          {/* Category pill — absolute top-left */}
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
            style={{
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            {product.category}
          </span>
          {/* Action buttons — visible on hover */}
          <div
            className="absolute right-3 top-3 flex gap-1.5 transition-all duration-200"
            style={{ opacity: hovered ? 1 : 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleEdit}
              title="Edit"
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-150 active:scale-95"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color =
                  "var(--accent)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-secondary)")
              }
            >
              <svg
                className="h-3.5 w-3.5"
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
            </button>
            <button
              onClick={handleDeleteClick}
              title="Delete"
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-150 active:scale-95"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color =
                  "var(--danger)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-secondary)")
              }
            >
              <svg
                className="h-3.5 w-3.5"
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
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3
            className="truncate font-heading text-sm font-semibold leading-snug"
            style={{ color: "var(--text-primary)" }}
          >
            {product.title}
          </h3>
          <div className="flex items-center gap-1">
            <svg
              className="h-3 w-3 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.062 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.287-3.957z" />
            </svg>
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              {product.rating.rate} ({product.rating.count})
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between pt-1">
            <p
              className="font-mono-price text-base font-bold"
              style={{ color: "var(--accent)" }}
            >
              ${product.price.toFixed(2)}
            </p>
            {(() => {
              const effectivelyInStock =
                product.inStock && product.stockCount > 0;
              return (
                <>
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: effectivelyInStock
                          ? "var(--success)"
                          : "var(--danger)",
                        boxShadow: effectivelyInStock
                          ? "0 0 6px var(--success)"
                          : "0 0 6px var(--danger)",
                      }}
                    />
                    <span
                      style={{
                        color: effectivelyInStock
                          ? "var(--success)"
                          : "var(--danger)",
                      }}
                    >
                      {effectivelyInStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </span>
                  {effectivelyInStock && (
                    <div className="flex items-center gap-1.5">
                      {product.stockCount <= 5 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      )}
                      <span
                        className="text-xs"
                        style={{
                          color:
                            product.stockCount <= 5
                              ? "#f59e0b"
                              : "var(--text-secondary)",
                        }}
                      >
                        {product.stockCount} in stock
                      </span>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </article>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete product?"
        message={`"${product.title}" will be permanently removed.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default ProductCard;
