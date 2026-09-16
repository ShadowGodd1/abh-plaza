"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Drawer({ open, onClose, title, description, children, size = "md", className }: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-ink/40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 h-full bg-surface shadow-[var(--shadow-drawer)]",
          "animate-in slide-in-from-right duration-240",
          {
            "w-full max-w-sm": size === "sm",
            "w-full max-w-md": size === "md",
            "w-full max-w-lg": size === "lg",
          },
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            {title && (
              <h2 id="drawer-title" className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-text-3 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center text-text-3 hover:text-text-primary hover:bg-surface-2 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100%-76px)]">{children}</div>
      </div>
    </div>
  );
}
