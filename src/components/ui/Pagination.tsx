import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [];
  if (current <= 3) {
    pages.push(1, 2, 3, 4, "...", total);
  } else if (current >= total - 2) {
    pages.push(1, "...", total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  return pages.filter((p, i, arr) => !(p === "..." && arr[i - 1] === "..."));
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const btnBase =
    "inline-flex items-center justify-center h-9 min-w-[2.25rem] px-3 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none active:scale-95";
  const activeBtn = "text-white cursor-default";
  const inactiveBtn = "hover:opacity-80";
  const disabledBtn = "cursor-not-allowed opacity-30";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 mt-10"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${btnBase} ${currentPage === 1 ? disabledBtn : inactiveBtn}`}
        style={{ color: "var(--text-secondary)" }}
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex items-center justify-center h-9 min-w-[2.25rem] text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`${btnBase} ${page === currentPage ? activeBtn : inactiveBtn}`}
            style={{
              backgroundColor:
                page === currentPage ? "var(--accent)" : "transparent",
              color: page === currentPage ? "#fff" : "var(--text-secondary)",
            }}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${btnBase} ${currentPage === totalPages ? disabledBtn : inactiveBtn}`}
        style={{ color: "var(--text-secondary)" }}
      >
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
