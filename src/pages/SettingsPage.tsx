import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Monitor,
  Bell,
  Database,
  Shield,
  LayoutGrid,
  List,
} from "lucide-react";

import Layout from "../components/layout/Layout";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ClearLogDialog from "../components/ui/ClearLogDialog";
import ChangePasswordDialog from "../components/ui/ChangePasswordDialog";
import { useAdminStore } from "../store/adminStore";
import { useProductsStore } from "../store/productsStore";

// ── Shared styles ─────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "1rem",
  padding: "1.5rem",
};

const cardTitleStyle: React.CSSProperties = {
  color: "var(--text-primary)",
  fontSize: "1rem",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "1.25rem",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "0.75rem",
  paddingBottom: "0.75rem",
};

const rowBorderStyle: React.CSSProperties = {
  ...rowStyle,
  borderBottom: "1px solid var(--border)",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "var(--text-primary)",
};

const descStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "var(--text-secondary)",
  marginTop: "0.125rem",
};

// ── Toggle Switch ─────────────────────────────────────────────────────────────

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none"
    style={{
      backgroundColor: checked ? "var(--accent)" : "var(--bg-tertiary)",
      border: "1px solid var(--border)",
    }}
  >
    <span
      className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
      style={{
        transform: checked ? "translateX(1.375rem)" : "translateX(0.25rem)",
      }}
    />
  </button>
);

// ── Segment Button helpers ────────────────────────────────────────────────────

interface SegmentButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const SegmentButton: React.FC<SegmentButtonProps> = ({
  active,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-150"
    style={
      active
        ? { backgroundColor: "var(--accent)", color: "#fff" }
        : {
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }
    }
  >
    {children}
  </button>
);

// ── Component ─────────────────────────────────────────────────────────────────

type DialogKind = "resetProducts" | null;

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const { preferences, profile, updatePreferences, clearActivityLog, logout } =
    useAdminStore();
  const { allProducts, clearLocalProducts } = useProductsStore();

  const [dialogKind, setDialogKind] = useState<DialogKind>(null);
  const [showClearLogDialog, setShowClearLogDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  // ── CSV export ────────────────────────────────────────────────────────────

  const handleExportCSV = () => {
    const headers = ["id", "title", "price", "category", "inStock", "rating"];
    const rows = allProducts.map((p) =>
      [
        p.id,
        `"${String(p.title).replace(/"/g, '""')}"`,
        p.price,
        `"${String(p.category).replace(/"/g, '""')}"`,
        p.inStock ? "true" : "false",
        p.rating?.rate ?? "",
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  // ── Confirm dialog actions ────────────────────────────────────────────────

  const handleConfirm = () => {
    if (dialogKind === "resetProducts") {
      clearLocalProducts();
      toast.success("Reset to API data");
    }
    setDialogKind(null);
  };

  const handleClearLogConfirmed = () => {
    clearActivityLog();
    setShowClearLogDialog(false);
    toast.success("Activity log cleared");
  };

  const dialogConfig: Record<
    Exclude<DialogKind, null>,
    { title: string; message: string }
  > = {
    resetProducts: {
      title: "Reset Products",
      message: "This will remove all local changes. Are you sure?",
    },
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Layout>
      <div className="mx-auto w-full max-w-2xl px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1
            className="font-heading text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Settings
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage your preferences and application settings
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* ══ CARD 1: Display Preferences ══════════════════════════════ */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>
              <Monitor size={18} style={{ color: "var(--accent)" }} />
              Display Preferences
            </h2>

            {/* Default View */}
            <div style={rowBorderStyle}>
              <div>
                <p style={labelStyle}>Default View</p>
                <p style={descStyle}>
                  Choose how products are displayed by default
                </p>
              </div>
              <div className="flex gap-2">
                <SegmentButton
                  active={preferences.defaultView === "grid"}
                  onClick={() => updatePreferences({ defaultView: "grid" })}
                >
                  <LayoutGrid size={14} />
                  Grid
                </SegmentButton>
                <SegmentButton
                  active={preferences.defaultView === "table"}
                  onClick={() => updatePreferences({ defaultView: "table" })}
                >
                  <List size={14} />
                  Table
                </SegmentButton>
              </div>
            </div>

            {/* Items Per Page */}
            <div style={rowStyle}>
              <div>
                <p style={labelStyle}>Items Per Page</p>
                <p style={descStyle}>How many products to show per page</p>
              </div>
              <div className="flex gap-2">
                {([10, 20, 50] as const).map((n) => (
                  <SegmentButton
                    key={n}
                    active={preferences.itemsPerPage === n}
                    onClick={() => updatePreferences({ itemsPerPage: n })}
                  >
                    {n}
                  </SegmentButton>
                ))}
              </div>
            </div>
          </div>

          {/* ══ CARD 2: Notification Preferences ═════════════════════════ */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>
              <Bell size={18} style={{ color: "var(--accent)" }} />
              Notifications
            </h2>

            {(
              [
                {
                  key: "onAdd" as const,
                  label: "Product Added",
                  desc: "Show a toast when a new product is added",
                },
                {
                  key: "onEdit" as const,
                  label: "Product Edited",
                  desc: "Show a toast when a product is updated",
                },
                {
                  key: "onDelete" as const,
                  label: "Product Deleted",
                  desc: "Show a toast when a product is removed",
                },
              ] as const
            ).map(({ key, label, desc }, idx, arr) => (
              <div
                key={key}
                style={idx < arr.length - 1 ? rowBorderStyle : rowStyle}
              >
                <div>
                  <p style={labelStyle}>{label}</p>
                  <p style={descStyle}>{desc}</p>
                </div>
                <ToggleSwitch
                  checked={preferences.showToasts[key]}
                  onChange={(val) =>
                    updatePreferences({
                      showToasts: {
                        ...preferences.showToasts,
                        [key]: val,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>

          {/* ══ CARD 3: Data Management ═══════════════════════════════════ */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>
              <Database size={18} style={{ color: "var(--accent)" }} />
              Data Management
            </h2>

            {/* Reset Products */}
            <div style={rowBorderStyle}>
              <div>
                <p style={labelStyle}>Reset Products</p>
                <p style={descStyle}>
                  Remove all locally added/edited products and reload from API
                </p>
              </div>
              <button
                onClick={() => setDialogKind("resetProducts")}
                className="rounded-xl px-4 py-1.5 text-sm font-medium transition-colors duration-150"
                style={{
                  color: "var(--danger)",
                  border: "1px solid var(--danger)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(239,68,68,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                }}
              >
                Reset
              </button>
            </div>

            {/* Export CSV */}
            <div style={rowBorderStyle}>
              <div>
                <p style={labelStyle}>Export Products</p>
                <p style={descStyle}>
                  Download all current products as a CSV file
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="rounded-xl px-4 py-1.5 text-sm font-medium transition-colors duration-150"
                style={{
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--bg-tertiary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                }}
              >
                Export CSV
              </button>
            </div>

            {/* Clear Activity Log */}
            <div style={rowStyle}>
              <div>
                <p style={labelStyle}>Clear Activity Log</p>
                <p style={descStyle}>Permanently delete all activity history</p>
              </div>
              <button
                onClick={() => setShowClearLogDialog(true)}
                className="rounded-xl px-4 py-1.5 text-sm font-medium transition-colors duration-150"
                style={{
                  color: "var(--danger)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(239,68,68,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                }}
              >
                Clear Log
              </button>
            </div>
          </div>

          {/* ══ CARD 4: Account ═══════════════════════════════════════════ */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>
              <Shield size={18} style={{ color: "var(--accent)" }} />
              Account
            </h2>

            {/* Email + Change Password */}
            <div style={rowBorderStyle}>
              <div>
                <p style={labelStyle}>{profile.email}</p>
                <p style={descStyle}>Administrator account</p>
              </div>
              <button
                onClick={() => setShowChangePasswordDialog(true)}
                className="rounded-xl px-4 py-1.5 text-sm font-medium transition-colors duration-150"
                style={{
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--bg-tertiary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                }}
              >
                Change Password
              </button>
            </div>

            {/* Sign Out */}
            <div style={rowStyle}>
              <div>
                <p style={labelStyle}>Sign Out</p>
                <p style={descStyle}>
                  You will be redirected to the login page
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                  toast.success("Signed out");
                }}
                className="rounded-xl px-4 py-1.5 text-sm font-medium text-white transition-all duration-150 active:scale-95"
                style={{ backgroundColor: "var(--danger)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#dc2626";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--danger)";
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirm Dialog ────────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={dialogKind !== null}
        title={dialogKind ? dialogConfig[dialogKind].title : ""}
        message={dialogKind ? dialogConfig[dialogKind].message : ""}
        onConfirm={handleConfirm}
        onCancel={() => setDialogKind(null)}
      />
      <ClearLogDialog
        isOpen={showClearLogDialog}
        onConfirm={handleClearLogConfirmed}
        onCancel={() => setShowClearLogDialog(false)}
      />
      <ChangePasswordDialog
        isOpen={showChangePasswordDialog}
        onClose={() => setShowChangePasswordDialog(false)}
      />
    </Layout>
  );
};

export default SettingsPage;
