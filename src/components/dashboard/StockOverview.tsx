import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CategoryStat } from "../../types/dashboard";

interface StockOverviewProps {
  categoryStats: CategoryStat[];
}

interface ChartRow {
  category: string;
  inStock: number;
  outOfStock: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const inStock = payload.find((p) => p.name === "In Stock")?.value ?? 0;
  const outOfStock = payload.find((p) => p.name === "Out of Stock")?.value ?? 0;
  return (
    <div
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "0.75rem 1rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        minWidth: 160,
      }}
    >
      <p
        className="font-heading font-semibold capitalize mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </p>
      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
        In Stock:{" "}
        <span style={{ color: "#22c55e", fontWeight: 600 }}>{inStock}</span>
      </p>
      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
        Out of Stock:{" "}
        <span style={{ color: "#ef4444", fontWeight: 600 }}>{outOfStock}</span>
      </p>
    </div>
  );
};

const StockOverview: React.FC<StockOverviewProps> = ({ categoryStats }) => {
  const chartData: ChartRow[] = categoryStats.map((s) => ({
    category:
      s.category.length > 10 ? s.category.slice(0, 10) + "…" : s.category,
    inStock: s.inStockCount,
    outOfStock: s.outOfStockCount,
  }));

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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2
          className="font-heading text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Stock Overview by Category
        </h2>

        {/* Custom legend pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                display: "inline-block",
              }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              In Stock
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                display: "inline-block",
              }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Out of Stock
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barGap={4} barCategoryGap="30%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="category"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--bg-tertiary)" }}
          />
          <Bar
            dataKey="inStock"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
            name="In Stock"
          />
          <Bar
            dataKey="outOfStock"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
            name="Out of Stock"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockOverview;
