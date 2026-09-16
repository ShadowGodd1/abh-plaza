import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <p className="text-sm text-text-3">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            "h-8 px-2 rounded-[var(--radius-sm)] inline-flex items-center justify-center gap-1 text-sm",
            "transition-colors duration-150",
            currentPage <= 1
              ? "text-text-3 cursor-not-allowed opacity-50"
              : "text-text-2 hover:bg-surface-2 hover:text-text-primary"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-sm text-text-3"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 rounded-[var(--radius-sm)] text-sm font-medium",
                "transition-colors duration-150",
                page === currentPage
                  ? "bg-gold text-ink"
                  : "text-text-2 hover:bg-surface-2 hover:text-text-primary"
              )}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            "h-8 px-2 rounded-[var(--radius-sm)] inline-flex items-center justify-center gap-1 text-sm",
            "transition-colors duration-150",
            currentPage >= totalPages
              ? "text-text-3 cursor-not-allowed opacity-50"
              : "text-text-2 hover:bg-surface-2 hover:text-text-primary"
          )}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
