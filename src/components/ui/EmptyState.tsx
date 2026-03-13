import React from "react";

export interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-up">
      <div
        className="flex h-24 w-24 items-center justify-center rounded-3xl mb-6"
        style={{ backgroundColor: "var(--accent-soft)" }}
      >
        <svg
          className="h-12 w-12"
          style={{ color: "var(--accent)", opacity: 0.7 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>

      <h3
        className="font-heading text-xl font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="mt-2 max-w-sm text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-8 rounded-xl px-6 py-2.5 text-sm font-heading font-semibold text-white transition-all duration-200 active:scale-95"
          style={{ backgroundColor: "var(--accent)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--accent-hover)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--accent)")
          }
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
