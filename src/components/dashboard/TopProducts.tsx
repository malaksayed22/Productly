import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, DollarSign } from "lucide-react";
import type { TopProduct } from "../../types/dashboard";

interface TopProductsProps {
  topExpensive: TopProduct[];
  topRated: TopProduct[];
}

interface ProductRankItemProps {
  product: TopProduct;
  rank: number;
  showPrice: boolean;
  showRating: boolean;
}

const StarRow = ({ rate }: { rate: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={12}
        fill={i < Math.round(rate) ? "#f59e0b" : "transparent"}
        stroke={i < Math.round(rate) ? "#f59e0b" : "currentColor"}
        style={{
          color: i < Math.round(rate) ? "#f59e0b" : "var(--border)",
          opacity: i < Math.round(rate) ? 1 : 0.35,
          flexShrink: 0,
        }}
      />
    ))}
  </div>
);

const ProductRankItem: React.FC<ProductRankItemProps> = ({
  product,
  rank,
  showPrice,
  showRating,
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() =>
        navigate(`/products/${product.id}`, { state: { from: "/dashboard" } })
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex w-full items-center gap-3 rounded-xl p-3 transition-all duration-150 cursor-pointer"
      style={{
        backgroundColor: hovered ? "var(--bg-tertiary)" : "transparent",
      }}
    >
      {/* Rank badge */}
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{
          backgroundColor: "var(--accent-soft)",
          color: "var(--accent)",
        }}
      >
        {rank}
      </div>

      {/* Thumbnail */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg p-1"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full rounded object-contain"
        />
      </div>

      {/* Title + category */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {product.title}
        </p>
        <span
          className="mt-0.5 inline-block rounded-full px-1.5 py-px text-xs capitalize"
          style={{
            backgroundColor: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          {product.category}
        </span>
      </div>

      {/* Right side */}
      <div className="ml-auto shrink-0 text-right">
        {showPrice && (
          <p
            className="font-mono text-sm font-bold"
            style={{ color: "var(--accent)" }}
          >
            ${product.price.toFixed(2)}
          </p>
        )}
        {showRating && (
          <div className="flex flex-col items-end gap-0.5">
            <StarRow rate={product.rating.rate} />
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              {product.rating.count} reviews
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "1rem",
  padding: "1.5rem",
};

const TopProducts: React.FC<TopProductsProps> = ({
  topExpensive,
  topRated,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* LEFT — Top 5 Most Expensive */}
      <div style={cardStyle}>
        <div className="mb-4 flex items-center gap-2">
          <DollarSign size={18} style={{ color: "var(--accent)" }} />
          <h2
            className="font-heading text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Top Expensive
          </h2>
        </div>
        <div className="flex flex-col">
          {topExpensive.map((product, i) => (
            <ProductRankItem
              key={product.id}
              product={product}
              rank={i + 1}
              showPrice
              showRating={false}
            />
          ))}
        </div>
      </div>

      {/* RIGHT — Top 5 Highest Rated */}
      <div style={cardStyle}>
        <div className="mb-4 flex items-center gap-2">
          <Star size={18} fill="#f59e0b" stroke="#f59e0b" />
          <h2
            className="font-heading text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Top Rated
          </h2>
        </div>
        <div className="flex flex-col">
          {topRated.map((product, i) => (
            <ProductRankItem
              key={product.id}
              product={product}
              rank={i + 1}
              showPrice={false}
              showRating
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
