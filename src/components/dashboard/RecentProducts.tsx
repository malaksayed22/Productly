import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TopProduct } from "../../types/dashboard";

interface RecentProductsProps {
  recentProducts: TopProduct[];
}

interface MiniCardProps {
  product: TopProduct;
}

const MiniCard: React.FC<MiniCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() =>
        navigate(`/products/${product.id}`, { state: { from: "/dashboard" } })
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="min-w-[160px] overflow-hidden rounded-xl cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: "var(--bg-tertiary)",
        border: hovered ? "1px solid var(--accent)" : "1px solid var(--border)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Image */}
      <div
        className="flex h-[120px] w-full items-center justify-center p-2"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <p
          className="truncate text-xs font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {product.title}
        </p>
        <p
          className="mt-1 font-mono text-sm font-bold"
          style={{ color: "var(--accent)" }}
        >
          ${product.price.toFixed(2)}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full shrink-0"
            style={{
              backgroundColor: product.inStock
                ? "var(--success)"
                : "var(--danger)",
            }}
          />
          <span
            className="text-xs"
            style={{
              color: product.inStock ? "var(--success)" : "var(--danger)",
            }}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

const RecentProducts: React.FC<RecentProductsProps> = ({ recentProducts }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "1rem",
        padding: "1.5rem",
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="font-heading text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Recently Added
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          View All →
        </button>
      </div>

      {/* Scrollable row (mobile) / 5-col grid (desktop) */}
      <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
        {recentProducts.map((product) => (
          <MiniCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecentProducts;
