import React, { useState, useEffect } from "react";
import {
  PackagePlus,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  Clock,
  Eraser,
  Search,
  CalendarRange,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAdminStore } from "../store/adminStore";
import type { ActivityLog } from "../types/admin";

/* ── helpers ── */
const ACTION_META: Record<
  ActivityLog["action"],
  { icon: React.ElementType; color: string; label: string }
> = {
  ADD_PRODUCT: { icon: PackagePlus, color: "#22c55e", label: "Added" },
  EDIT_PRODUCT: { icon: Pencil, color: "#06b6d4", label: "Edited" },
  DELETE_PRODUCT: { icon: Trash2, color: "#ef4444", label: "Deleted" },
  LOGIN: { icon: LogIn, color: "var(--accent)", label: "Login" },
  LOGOUT: { icon: LogOut, color: "#f59e0b", label: "Logout" },
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const FILTER_OPTIONS: {
  value: ActivityLog["action"] | "ALL";
  label: string;
}[] = [
  { value: "ALL", label: "All" },
  { value: "ADD_PRODUCT", label: "Added" },
  { value: "EDIT_PRODUCT", label: "Edited" },
  { value: "DELETE_PRODUCT", label: "Deleted" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
];

const ActivityLogPage: React.FC = () => {
  const { activityLog, clearActivityLog } = useAdminStore();
  const [filter, setFilter] = useState<ActivityLog["action"] | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  useEffect(() => {
    setPage(1);
  }, [filter, search, dateFrom, dateTo]);

  const filtered = activityLog.filter((entry) => {
    const matchAction = filter === "ALL" || entry.action === filter;
    const matchSearch =
      search.trim() === "" ||
      entry.label.toLowerCase().includes(search.toLowerCase());
    const entryDate = new Date(entry.timestamp);
    const matchFrom = dateFrom === "" || entryDate >= new Date(dateFrom);
    const matchTo =
      dateTo === "" || entryDate <= new Date(dateTo + "T23:59:59");
    return matchAction && matchSearch && matchFrom && matchTo;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Layout>
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        {/* Header */}
        <div
          className="border-l-4 pl-4"
          style={{ borderColor: "var(--accent)" }}
        >
          <h1
            className="font-heading text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Activity Log
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            A history of all actions performed in the dashboard.
          </p>
        </div>

        {/* Toolbar */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl p-4"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Search */}
          <div
            className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
            }}
          >
            <Search size={14} style={{ color: "var(--text-secondary)" }} />
            <input
              type="text"
              placeholder="Search activity…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>

          {/* Filter dropdown */}
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as ActivityLog["action"] | "ALL")
            }
            className="rounded-xl px-3 py-2 text-sm outline-none cursor-pointer"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <CalendarRange
              size={14}
              style={{ color: "var(--text-secondary)" }}
            />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-xl px-2 py-1.5 text-xs outline-none"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              –
            </span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-xl px-2 py-1.5 text-xs outline-none"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
            {(dateFrom || dateTo) && (
              <button
                type="button"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
                className="text-xs font-semibold"
                style={{ color: "#ef4444" }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Clear button */}
          {activityLog.length > 0 && (
            <button
              type="button"
              onClick={clearActivityLog}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <Eraser size={13} />
              Clear all
            </button>
          )}
        </div>

        {/* Log entries */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Clock
                size={32}
                style={{ color: "var(--text-secondary)", opacity: 0.4 }}
              />
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {activityLog.length === 0
                  ? "No activity recorded yet."
                  : "No results match your filter."}
              </p>
            </div>
          ) : (
            <ul>
              {paginated.map((entry, i) => {
                const meta = ACTION_META[entry.action];
                const Icon = meta.icon;
                const isLast = i === paginated.length - 1;
                return (
                  <li
                    key={entry.id}
                    className="flex items-start gap-4 px-5 py-4"
                    style={{
                      borderBottom: isLast ? "none" : "1px solid var(--border)",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${meta.color}1f` }}
                    >
                      <Icon size={15} style={{ color: meta.color }} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {/* Action badge + label */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                          style={{
                            backgroundColor: `${meta.color}1f`,
                            color: meta.color,
                          }}
                        >
                          {meta.label}
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {entry.label}
                        </span>
                      </div>

                      {/* Timestamp */}
                      <p
                        className="mt-1 flex items-center gap-1 text-[11px]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Clock size={10} />
                        {formatDate(entry.timestamp)}
                        <span className="mx-1">·</span>
                        {timeAgo(entry.timestamp)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-opacity disabled:opacity-40"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              ← Prev
            </button>
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-opacity disabled:opacity-40"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Count footer */}
        {filtered.length > 0 && (
          <p
            className="text-center text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            entries
          </p>
        )}
      </div>
    </Layout>
  );
};

export default ActivityLogPage;
