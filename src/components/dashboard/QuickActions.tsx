import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  LayoutGrid,
  AlertTriangle,
  ChevronRight,
  ScrollText,
} from "lucide-react";

interface ActionCard {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  desc: string;
  path: string;
}

const ACTIONS: ActionCard[] = [
  {
    icon: PlusCircle,
    iconColor: "var(--accent)",
    title: "Add New Product",
    desc: "Add a product to your inventory",
    path: "/products/add",
  },
  {
    icon: LayoutGrid,
    iconColor: "#06b6d4",
    title: "Browse Products",
    desc: "View and manage all products",
    path: "/products",
  },
  {
    icon: AlertTriangle,
    iconColor: "#ef4444",
    title: "Out of Stock",
    desc: "Review unavailable products",
    path: "/products?stock=outOfStock",
  },
  {
    icon: ScrollText,
    iconColor: "#f59e0b",
    title: "Activity Log",
    desc: "View all recent dashboard activity",
    path: "/activity",
  },
];

interface ActionItemProps {
  card: ActionCard;
}

const ActionItem: React.FC<ActionItemProps> = ({ card }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const Icon = card.icon;

  return (
    <div
      onClick={() => navigate(card.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-all duration-200"
      style={{
        border: hovered
          ? `1px solid ${card.iconColor}`
          : "1px solid var(--border)",
        backgroundColor: hovered ? "var(--bg-tertiary)" : "transparent",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
      }}
    >
      {/* Icon circle */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${card.iconColor}1f` }}
      >
        <Icon size={18} style={{ color: card.iconColor }} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p
          className="font-heading text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {card.title}
        </p>
        <p
          className="mt-0.5 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          {card.desc}
        </p>
      </div>

      {/* Chevron */}
      <ChevronRight
        size={16}
        className="ml-auto shrink-0 transition-transform duration-200"
        style={{
          color: "var(--text-secondary)",
          transform: hovered ? "translateX(2px)" : "translateX(0)",
        }}
      />
    </div>
  );
};

const QuickActions: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "1rem",
        padding: "1.5rem",
      }}
    >
      <h2
        className="font-heading text-lg font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Quick Actions
      </h2>

      <div className="flex flex-col gap-3">
        {ACTIONS.map((card) => (
          <ActionItem key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
