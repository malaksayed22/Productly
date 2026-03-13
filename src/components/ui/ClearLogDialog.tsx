import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { useAdminStore } from "../../store/adminStore";

export interface ClearLogDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ClearLogDialog: React.FC<ClearLogDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const { verifyPassword } = useAdminStore();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state whenever dialog opens
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError("");
      setShowPassword(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  const handleConfirm = () => {
    if (!verifyPassword(password)) {
      setError("Incorrect password. Please try again.");
      setPassword("");
      inputRef.current?.focus();
      return;
    }
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-log-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            {/* Warning icon */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(239,68,68,0.12)" }}
            >
              <svg
                className="h-5 w-5"
                style={{ color: "var(--danger)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <div className="flex-1">
              <h3
                id="clear-log-dialog-title"
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Clear Activity Log
              </h3>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Permanently delete all activity history. This cannot be undone.
              </p>
            </div>
          </div>

          {/* Password field */}
          <div className="mt-5">
            <label
              htmlFor="clear-log-password"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Enter admin password to confirm
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="clear-log-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                placeholder="Password"
                className="w-full rounded-xl px-4 py-2.5 pr-11 text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: error
                    ? "1px solid var(--danger)"
                    : "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-opacity duration-150"
                style={{ color: "var(--text-secondary)", opacity: 0.7 }}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a10.05 10.05 0 011.875.175M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                ) : (
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p
                className="mt-1.5 text-xs font-medium"
                style={{ color: "var(--danger)" }}
              >
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            disabled={!password}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClearLogDialog;
