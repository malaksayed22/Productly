import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { PriceBucket } from "../../types/dashboard";

interface PriceRangeDistributionProps {
  priceBuckets: PriceBucket[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: PriceBucket }[];
}) => {
  if (!active || !payload?.length) return null;
  const bucket = payload[0].payload;
  const shown = bucket.productNames.slice(0, 3);
  const extra = bucket.productNames.length - 3;

  return (
    <div
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "0.75rem 1rem",
        minWidth: 180,
        maxWidth: 240,
      }}
    >
      <p
        className="font-heading font-semibold mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {bucket.range}
      </p>
      <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
        <span style={{ color: "var(--accent)", fontWeight: 600 }}>
          {bucket.count}
        </span>{" "}
        {bucket.count === 1 ? "product" : "products"}
      </p>
      {shown.length > 0 && (
        <ul className="flex flex-col gap-0.5">
          {shown.map((name) => (
            <li
              key={name}
              className="text-xs truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              · {name}
            </li>
          ))}
          {extra > 0 && (
            <li className="text-xs" style={{ color: "var(--text-secondary)" }}>
              + {extra} more
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const getOpacity = (index: number) => Math.max(0.4, 1 - index * 0.15);

const PriceRangeDistribution: React.FC<PriceRangeDistributionProps> = ({
  priceBuckets,
}) => {
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
      <div className="mb-4">
        <h2
          className="font-heading text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Price Range Distribution
        </h2>
        <p
          className="text-sm mt-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Number of products per price range
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={priceBuckets} barCategoryGap="25%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="range"
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--bg-tertiary)" }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {priceBuckets.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill="var(--accent)"
                opacity={getOpacity(index)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceRangeDistribution;
