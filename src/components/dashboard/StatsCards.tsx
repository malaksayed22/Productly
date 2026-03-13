import React, { useState } from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  DollarSign,
  Activity,
} from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

interface StatsCardsProps {
  stats: {
    totalProducts: number;
    inStockCount: number;
    outOfStockCount: number;
    totalValue: number;
  };
}

interface CardConfig {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<CardConfig> = ({
  label,
  value,
  icon: Icon,
  color,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: `1px solid var(--border)`,
        borderTop: hovered ? `3px solid ${color}` : "1px solid var(--border)",
        borderRadius: "1rem",
        padding: "1.5rem",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          backgroundColor: `${color}1f`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Icon size={22} style={{ color }} />
      </div>

      {/* Value */}
      <p
        className="font-heading"
        style={{
          fontSize: "1.875rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.2,
          marginBottom: "0.25rem",
        }}
      >
        {value}
      </p>

      {/* Label */}
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
        {label}
      </p>
    </div>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const activityLog = useAdminStore((s) => s.activityLog);
  const today = new Date().toDateString();
  const actionsToday = activityLog.filter(
    (e) => new Date(e.timestamp).toDateString() === today,
  ).length;

  const cards: CardConfig[] = [
    {
      label: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "var(--accent)",
    },
    {
      label: "In Stock",
      value: stats.inStockCount.toLocaleString(),
      icon: CheckCircle,
      color: "#22c55e",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStockCount.toLocaleString(),
      icon: XCircle,
      color: "#ef4444",
    },
    {
      label: "Total Inventory Value",
      value: `$${stats.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "#f59e0b",
    },
    {
      label: "Actions Today",
      value: actionsToday.toLocaleString(),
      icon: Activity,
      color: "#06b6d4",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;
