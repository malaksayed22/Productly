import React, { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import Button from "./Button";
import { useAdminStore } from "../../store/adminStore";

export interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { changePassword } = useAdminStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentError, setCurrentError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [newError, setNewError] = useState("");
  const currentRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setCurrentError("");
      setNewError("");
      setConfirmError("");
      setTimeout(() => currentRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    let valid = true;

    if (!currentPassword) {
      setCurrentError("Enter your current password.");
      valid = false;
    } else {
      setCurrentError("");
    }

    if (newPassword.length < 6) {
      setNewError("New password must be at least 6 characters.");
      valid = false;
    } else {
      setNewError("");
    }

    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      valid = false;
    } else {
      setConfirmError("");
    }

    if (!valid) return;

    const ok = changePassword(currentPassword, newPassword);
    if (!ok) {
      setCurrentError("Incorrect current password.");
      setCurrentPassword("");
      currentRef.current?.focus();
      return;
    }

    onClose();
    // import toast dynamically to avoid circular deps
    import("react-hot-toast").then(({ default: toast }) =>
      toast.success("Password updated successfully!"),
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-pw-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
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
        <div className="px-6 pt-6 pb-4 flex items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            <KeyRound size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3
              id="change-pw-title"
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Change Password
            </h3>
            <p className="mt-0.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              Enter your current password then choose a new one.
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4 px-6 pb-4">
          {/* Current password */}
          <PasswordField
            id="cp-current"
            label="Current Password"
            ref={currentRef}
            value={currentPassword}
            show={showCurrent}
            onToggleShow={() => setShowCurrent((v) => !v)}
            onChange={(v) => {
              setCurrentPassword(v);
              if (currentError) setCurrentError("");
            }}
            error={currentError}
            onEnter={handleSubmit}
          />

          {/* New password */}
          <PasswordField
            id="cp-new"
            label="New Password"
            value={newPassword}
            show={showNew}
            onToggleShow={() => setShowNew((v) => !v)}
            onChange={(v) => {
              setNewPassword(v);
              if (newError) setNewError("");
            }}
            error={newError}
            hint="Minimum 6 characters"
            onEnter={handleSubmit}
          />

          {/* Confirm new password */}
          <PasswordField
            id="cp-confirm"
            label="Confirm New Password"
            value={confirmPassword}
            show={showConfirm}
            onToggleShow={() => setShowConfirm((v) => !v)}
            onChange={(v) => {
              setConfirmPassword(v);
              if (confirmError) setConfirmError("");
            }}
            error={confirmError}
            onEnter={handleSubmit}
          />
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Small reusable password input ─────────────────────────────────────────────

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  onEnter?: () => void;
}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ id, label, value, show, onToggleShow, onChange, error, hint, onEnter }, ref) => (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
          className="w-full rounded-xl px-4 py-2.5 pr-11 text-sm outline-none transition-all duration-200"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            border: error ? "1px solid var(--danger)" : "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
        <button
          type="button"
          onClick={onToggleShow}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs font-medium" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
          {hint}
        </p>
      )}
    </div>
  ),
);

PasswordField.displayName = "PasswordField";

export default ChangePasswordDialog;
