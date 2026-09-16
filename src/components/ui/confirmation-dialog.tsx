"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import Button from "./button";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  loading?: boolean;
}

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    confirmRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    dialog.addEventListener("keydown", trapFocus);
    return () => dialog.removeEventListener("keydown", trapFocus);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink/40 animate-in fade-in duration-200" />
      <div
        ref={dialogRef}
        className={cn(
          "relative z-10 w-full max-w-sm bg-surface rounded-[var(--radius-lg)] p-6",
          "shadow-[var(--shadow-modal)] animate-in fade-in zoom-in-95 duration-200"
        )}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={description ? "confirm-desc" : undefined}
      >
        <h2 id="confirm-title" className="text-lg font-semibold text-text-primary">
          {title}
        </h2>
        {description && (
          <p id="confirm-desc" className="text-sm text-text-3 mt-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            variant={variant === "danger" ? "danger" : "primary"}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
