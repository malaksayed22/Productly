import React, { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  Upload,
  X,
} from "lucide-react";

import Layout from "../components/layout/Layout";
import EmptyState from "../components/ui/EmptyState";
import ClearLogDialog from "../components/ui/ClearLogDialog";
import Pagination from "../components/ui/Pagination";
import { useAdminStore } from "../store/adminStore";

// ── Zod Schema ────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  avatar: z
    .string()
    .refine(
      (v) =>
        v === "" || v.startsWith("data:image/") || /^https?:\/\/.+/.test(v),
      "Avatar must be a valid URL or uploaded image",
    ),
  bio: z.string().max(120, "Bio must be 120 characters or fewer"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────

const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const formatTimestamp = (iso: string): string => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${date} · ${hh}:${mm}`;
};

const ACTION_CONFIG = {
  ADD_PRODUCT: {
    Icon: PlusCircle,
    color: "var(--success)",
    bg: "rgba(34,197,94,0.12)",
  },
  EDIT_PRODUCT: {
    Icon: Pencil,
    color: "var(--accent)",
    bg: "var(--accent-soft)",
  },
  DELETE_PRODUCT: {
    Icon: Trash2,
    color: "var(--danger)",
    bg: "rgba(239,68,68,0.12)",
  },
  LOGIN: {
    Icon: LogIn,
    color: "var(--warning)",
    bg: "rgba(245,158,11,0.12)",
  },
  LOGOUT: {
    Icon: LogOut,
    color: "var(--text-secondary)",
    bg: "rgba(139,139,167,0.12)",
  },
} as const;

// ── Shared style helpers ──────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "1rem",
  padding: "1.5rem",
};

const inputStyle: React.CSSProperties = {
  backgroundColor: "var(--bg-tertiary)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  borderRadius: "0.75rem",
  padding: "0.625rem 0.875rem",
  width: "100%",
  fontSize: "0.875rem",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "var(--text-secondary)",
  marginBottom: "0.375rem",
};

const errorStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "var(--danger)",
  marginTop: "0.25rem",
};

// ── Component ─────────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab =
    searchParams.get("tab") === "activity" ? "activity" : "profile";

  const { profile, activityLog, updateProfile, clearActivityLog } =
    useAdminStore();

  // ── File upload ──────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploaded, setIsUploaded] = useState(
    () => profile.avatar?.startsWith("data:image/") ?? false,
  );
  const [showClearDialog, setShowClearDialog] = useState(false);

  // ── React Hook Form ──────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar ?? "",
      bio: profile.bio ?? "",
    },
  });

  const avatarUrl = watch("avatar");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    const MAX_SIDE = 400;
    const QUALITY = 0.85;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        // Calculate scaled dimensions keeping aspect ratio
        let { width, height } = img;
        if (width > MAX_SIDE || height > MAX_SIDE) {
          if (width >= height) {
            height = Math.round((height / width) * MAX_SIDE);
            width = MAX_SIDE;
          } else {
            width = Math.round((width / height) * MAX_SIDE);
            height = MAX_SIDE;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", QUALITY);
        setValue("avatar", compressed, { shouldValidate: true });
        setIsUploaded(true);
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
    // reset so same file can be re-picked
    e.target.value = "";
  };

  const handleRemoveUpload = () => {
    setValue("avatar", "", { shouldValidate: true });
    setIsUploaded(false);
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data);
    reset(data); // keep form in sync with saved values
    setIsUploaded(data.avatar.startsWith("data:image/"));
    toast.success("Profile updated!");
  };

  // ── Activity counts ──────────────────────────────────────────────────────

  const productsAdded = activityLog.filter(
    (e) => e.action === "ADD_PRODUCT",
  ).length;
  const edits = activityLog.filter((e) => e.action === "EDIT_PRODUCT").length;
  const deletions = activityLog.filter(
    (e) => e.action === "DELETE_PRODUCT",
  ).length;

  // ── Handlers ────────────────────────────────────────────────────────────

  const goToTab = (tab: "profile" | "activity") => {
    setSearchParams(tab === "activity" ? { tab: "activity" } : {});
  };

  const handleClearActivity = () => {
    setShowClearDialog(true);
  };

  const handleClearConfirmed = () => {
    clearActivityLog();
    setShowClearDialog(false);
    toast.success("Activity log cleared.");
  };

  // ── Activity log filters & pagination ──────────────────────────────────
  const [logPage, setLogPage] = useState(1);
  const [logDateFrom, setLogDateFrom] = useState("");
  const [logDateTo, setLogDateTo] = useState("");
  const [logActionFilter, setLogActionFilter] = useState("");

  const filteredLog = useMemo(() => {
    return activityLog.filter((entry) => {
      if (logActionFilter && entry.action !== logActionFilter) return false;
      if (logDateFrom && entry.timestamp.slice(0, 10) < logDateFrom)
        return false;
      if (logDateTo && entry.timestamp.slice(0, 10) > logDateTo) return false;
      return true;
    });
  }, [activityLog, logActionFilter, logDateFrom, logDateTo]);

  const LOG_PAGE_SIZE = 10;
  const logTotalPages = Math.max(
    1,
    Math.ceil(filteredLog.length / LOG_PAGE_SIZE),
  );
  const safeLogPage = Math.min(logPage, logTotalPages);
  const visibleLog = filteredLog.slice(
    (safeLogPage - 1) * LOG_PAGE_SIZE,
    safeLogPage * LOG_PAGE_SIZE,
  );

  const updateLogFilter = (updates: {
    action?: string;
    from?: string;
    to?: string;
  }) => {
    if (updates.action !== undefined) setLogActionFilter(updates.action);
    if (updates.from !== undefined) setLogDateFrom(updates.from);
    if (updates.to !== undefined) setLogDateTo(updates.to);
    setLogPage(1);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Layout>
      <div className="mx-auto w-full max-w-5xl">
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1
            className="font-heading text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            My Profile
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage your account and review your activity
          </p>
        </div>

        {/* ── Tab bar ─────────────────────────────────────────────────────── */}
        <div
          className="mb-6 flex w-fit gap-1 rounded-xl p-1"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          {(["profile", "activity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => goToTab(tab)}
              className="rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200"
              style={
                activeTab === tab
                  ? { backgroundColor: "var(--accent)", color: "#fff" }
                  : {
                      backgroundColor: "transparent",
                      color: "var(--text-secondary)",
                    }
              }
            >
              {tab === "profile" ? "Profile" : "Activity Log"}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 1 — PROFILE
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* ── LEFT: Avatar & Identity ──────────────────────────────── */}
            <div style={cardStyle}>
              <div className="flex flex-col items-center text-center">
                {/* Avatar circle */}
                <div
                  className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    border: "2px solid var(--border)",
                  }}
                >
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      className="font-heading text-2xl font-bold select-none"
                      style={{ color: "var(--accent)" }}
                    >
                      {getInitials(profile.name)}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h2
                  className="font-heading text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {profile.name}
                </h2>

                {/* Role badge */}
                <span
                  className="mt-2 rounded-full px-3 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  {profile.role}
                </span>

                {/* Email */}
                <p
                  className="mt-2 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {profile.email}
                </p>

                {/* Bio */}
                {profile.bio && (
                  <p
                    className="mt-2 max-w-xs text-sm italic"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    "{profile.bio}"
                  </p>
                )}

                {/* Divider */}
                <div
                  className="my-5 w-full"
                  style={{ height: "1px", backgroundColor: "var(--border)" }}
                />

                {/* Quick stats: 3 cols */}
                <div className="grid w-full grid-cols-3 gap-2">
                  {[
                    { label: "Products Added", value: productsAdded },
                    { label: "Edits Made", value: edits },
                    { label: "Deletions", value: deletions },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <span
                        className="font-heading text-xl font-bold"
                        style={{ color: "var(--accent)" }}
                      >
                        {value}
                      </span>
                      <span
                        className="text-xs text-center leading-tight"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Edit form ─────────────────────────────────────── */}
            <div style={cardStyle}>
              <h3
                className="font-heading text-lg font-bold mb-5"
                style={{ color: "var(--text-primary)" }}
              >
                Edit Profile
              </h3>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {/* Name */}
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    {...register("name")}
                    className="field-input"
                    style={inputStyle}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p style={errorStyle}>{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    {...register("email")}
                    type="email"
                    className="field-input"
                    style={inputStyle}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p style={errorStyle}>{errors.email.message}</p>
                  )}
                </div>

                {/* Avatar URL + upload ───────────────────────────── */}
                <div>
                  <label style={labelStyle}>Avatar</label>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {isUploaded && avatarUrl ? (
                    /* Show uploaded image preview with remove button */
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
                        style={{ border: "2px solid var(--border)" }}
                      />
                      <div className="flex flex-col gap-1.5">
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Photo uploaded
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors duration-150"
                            style={{
                              backgroundColor: "var(--accent-soft)",
                              color: "var(--accent)",
                            }}
                          >
                            <Upload size={11} />
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveUpload}
                            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors duration-150"
                            style={{
                              backgroundColor: "rgba(239,68,68,0.1)",
                              color: "var(--danger)",
                            }}
                          >
                            <X size={11} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* URL input + upload button side by side */
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          {...register("avatar")}
                          className="field-input"
                          style={{ ...inputStyle, flex: 1, width: "auto" }}
                          placeholder="https://example.com/avatar.png"
                          onChange={(e) => {
                            register("avatar").onChange(e);
                            setIsUploaded(false);
                          }}
                        />
                        {avatarUrl && !isUploaded && (
                          <img
                            src={avatarUrl}
                            alt="Preview"
                            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                            style={{ border: "2px solid var(--border)" }}
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                            onLoad={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "block";
                            }}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          border: "1px solid var(--border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <Upload size={12} />
                        Upload from device
                      </button>
                    </div>
                  )}

                  {errors.avatar && (
                    <p style={errorStyle}>{errors.avatar.message}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label style={labelStyle}>Bio</label>
                  <textarea
                    {...register("bio")}
                    className="field-input"
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: "80px",
                    }}
                    placeholder="A short bio (max 120 chars)"
                    rows={3}
                  />
                  {errors.bio && <p style={errorStyle}>{errors.bio.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: "var(--accent)" }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "var(--accent-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "var(--accent)";
                  }}
                >
                  {isSubmitting ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 2 — ACTIVITY LOG
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "activity" && (
          <div style={cardStyle}>
            {/* Header row */}
            <div className="mb-5 flex items-center justify-between">
              <h3
                className="font-heading text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Activity Log
              </h3>

              {activityLog.length > 0 && (
                <button
                  onClick={handleClearActivity}
                  className="rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-200"
                  style={{
                    color: "var(--danger)",
                    backgroundColor: "transparent",
                    border: "1px solid var(--danger)",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "rgba(239,68,68,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter row */}
            <div className="mb-5 flex flex-wrap items-end gap-3">
              {/* Action type */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Action
                </label>
                <select
                  value={logActionFilter}
                  onChange={(e) => updateLogFilter({ action: e.target.value })}
                  className="rounded-xl border px-3 py-2 text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All actions</option>
                  <option value="ADD_PRODUCT">Added</option>
                  <option value="EDIT_PRODUCT">Edited</option>
                  <option value="DELETE_PRODUCT">Deleted</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGOUT">Logout</option>
                </select>
              </div>

              {/* Date from */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  From
                </label>
                <input
                  type="date"
                  value={logDateFrom}
                  onChange={(e) => updateLogFilter({ from: e.target.value })}
                  className="rounded-xl border px-3 py-2 text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Date to */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  To
                </label>
                <input
                  type="date"
                  value={logDateTo}
                  onChange={(e) => updateLogFilter({ to: e.target.value })}
                  className="rounded-xl border px-3 py-2 text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Active filter count + reset */}
              {(logActionFilter || logDateFrom || logDateTo) && (
                <button
                  onClick={() =>
                    updateLogFilter({ action: "", from: "", to: "" })
                  }
                  className="rounded-xl border px-3 py-2 text-sm font-medium transition-colors duration-200"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    ((
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "var(--bg-tertiary)")
                  }
                  onMouseLeave={(e) =>
                    ((
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent")
                  }
                >
                  Reset filters
                </button>
              )}

              {/* Result count */}
              <span
                className="ml-auto text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {filteredLog.length}{" "}
                {filteredLog.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            {/* Empty state */}
            {visibleLog.length === 0 ? (
              <EmptyState
                title="No activity yet"
                message="Your actions will appear here as you use the dashboard."
              />
            ) : (
              <ul>
                {visibleLog.map((entry, idx) => {
                  const cfg = ACTION_CONFIG[entry.action];
                  const isLast = idx === visibleLog.length - 1;

                  return (
                    <li
                      key={entry.id}
                      className="flex items-center gap-4 py-3"
                      style={
                        !isLast
                          ? { borderBottom: "1px solid var(--border)" }
                          : undefined
                      }
                    >
                      {/* Icon badge */}
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        <cfg.Icon size={15} style={{ color: cfg.color }} />
                      </div>

                      {/* Label + product name */}
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {entry.label}
                        </p>
                        {entry.productName && (
                          <p
                            className="truncate text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {entry.productName}
                          </p>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span
                        className="flex-shrink-0 text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Pagination */}
            {logTotalPages > 1 && (
              <Pagination
                currentPage={safeLogPage}
                totalPages={logTotalPages}
                onPageChange={setLogPage}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Secure Clear Log Dialog ───────────────────────────────────── */}
      <ClearLogDialog
        isOpen={showClearDialog}
        onConfirm={handleClearConfirmed}
        onCancel={() => setShowClearDialog(false)}
      />
    </Layout>
  );
};

export default ProfilePage;
