import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CategoryStat } from "../../types/dashboard";

interface CategoryBreakdownProps {
  categoryStats: CategoryStat[];
}

const COLORS = [
  "#6c63ff",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
];
const getColor = (i: number) => COLORS[i % COLORS.length];

const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "1rem",
  padding: "1.5rem",
};

/* ── Custom Tooltip ── */
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: CategoryStat }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "0.75rem 1rem",
        minWidth: 160,
      }}
    >
      <p
        className="font-heading font-semibold capitalize"
        style={{ color: "var(--text-primary)", marginBottom: 4 }}
      >
        {d.category}
      </p>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
        Items: <span style={{ color: "var(--text-primary)" }}>{d.count}</span>
      </p>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
        Avg price:{" "}
        <span style={{ color: "var(--text-primary)" }}>
          ${d.avgPrice.toFixed(2)}
        </span>
      </p>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
        In stock: <span style={{ color: "#22c55e" }}>{d.inStockPercent}%</span>
      </p>
    </div>
  );
};

/* ── Custom Legend ── */
const CustomLegend = ({ stats }: { stats: CategoryStat[] }) => (
  <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
    {stats.map((s, i) => (
      <div key={s.category} className="flex items-center gap-1.5">
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: getColor(i),
            flexShrink: 0,
          }}
        />
        <span
          className="capitalize text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          {s.category}
        </span>
      </div>
    ))}
  </div>
);

/* ── Main Component ── */
const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categoryStats,
}) => {
  const total = categoryStats.reduce((s, c) => s + c.count, 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* LEFT — Donut chart */}
      <div style={cardStyle}>
        <h2
          className="font-heading text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Category Distribution
        </h2>

        <div className="relative">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryStats}
                dataKey="count"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
              >
                {categoryStats.map((_, i) => (
                  <Cell key={i} fill={getColor(i)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            style={{ top: 0 }}
          >
            <span
              className="font-heading text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {total}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Products
            </span>
          </div>
        </div>

        <CustomLegend stats={categoryStats} />
      </div>

      {/* RIGHT — Details table */}
      <div style={cardStyle}>
        <h2
          className="font-heading text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Category Details
        </h2>

        <div
          style={{
            borderRadius: "0.75rem",
            overflow: "hidden",
            border: "1px solid var(--border)",
            overflowX: "auto",
          }}
        >
          <table
            className="w-full text-sm"
            style={{ borderCollapse: "collapse", tableLayout: "fixed", minWidth: 380 }}
          >
            <colgroup>
              <col style={{ width: "38%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "28%" }} />
            </colgroup>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Category", "Items", "Avg Price", "In Stock %"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categoryStats.map((s, i) => (
                <tr
                  key={s.category}
                  style={{
                    backgroundColor:
                      i % 2 === 1 ? "var(--bg-tertiary)" : "transparent",
                    borderBottom:
                      i < categoryStats.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  {/* Category pill */}
                  <td className="px-4 py-3" style={{ maxWidth: 0 }}>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize max-w-full"
                      style={{
                        backgroundColor: `${getColor(i)}1a`,
                        color: getColor(i),
                        display: "inline-flex",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: getColor(i),
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.category}
                      </span>
                    </span>
                  </td>

                  {/* Count */}
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--text-primary)", whiteSpace: "nowrap" }}
                  >
                    {s.count}
                  </td>

                  {/* Avg price */}
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}
                  >
                    ${s.avgPrice.toFixed(2)}
                  </td>

                  {/* In-stock % with progress bar */}
                  <td className="px-4 py-3">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div
                        style={{
                          flexGrow: 1,
                          height: 6,
                          borderRadius: 999,
                          backgroundColor: "var(--border)",
                          overflow: "hidden",
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            width: `${s.inStockPercent}%`,
                            height: "100%",
                            borderRadius: 999,
                            backgroundColor:
                              s.inStockPercent >= 70
                                ? "#22c55e"
                                : s.inStockPercent >= 40
                                  ? "#f59e0b"
                                  : "#ef4444",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          width: 32,
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {s.inStockPercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
