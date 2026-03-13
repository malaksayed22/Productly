import React from "react";

type StockFilter = "all" | "inStock" | "outOfStock";

export interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  stockFilter: StockFilter;
  setStockFilter: (f: StockFilter) => void;
  categories: string[];
}

const STOCK_OPTIONS: { value: StockFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "inStock", label: "In Stock" },
  { value: "outOfStock", label: "Out of Stock" },
];

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  stockFilter,
  setStockFilter,
  categories,
}) => {
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:flex-wrap"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px]">
        <span
          className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center"
          style={{ color: "var(--text-secondary)" }}
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
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="block w-full rounded-full py-2 pl-10 pr-4 text-sm outline-none transition-all duration-200"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Category dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        aria-label="Filter by category"
        className="rounded-full py-2 pl-4 pr-8 text-sm capitalize outline-none transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          border: "1px solid var(--border)",
          color: selectedCategory ? "var(--accent)" : "var(--text-secondary)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat} className="capitalize">
            {cat}
          </option>
        ))}
      </select>

      {/* Stock filter — pill toggle group */}
      <div
        className="flex rounded-full overflow-hidden shrink-0 p-0.5"
        role="group"
        aria-label="Filter by stock"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          border: "1px solid var(--border)",
        }}
      >
        {STOCK_OPTIONS.map(({ value, label }) => {
          const isActive = stockFilter === value;
          return (
            <button
              key={value}
              onClick={() => setStockFilter(value)}
              aria-pressed={isActive}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: isActive ? "var(--accent)" : "transparent",
                color: isActive ? "#fff" : "var(--text-secondary)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFilters;
