"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, type === "error" ? 8000 : 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle size={18} className="text-success" />,
    error: <AlertCircle size={18} className="text-danger" />,
    warning: <AlertTriangle size={18} className="text-warning" />,
    info: <Info size={18} className="text-info" />,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 p-4 bg-surface rounded-[var(--radius-lg)] shadow-[var(--shadow-dropdown)]",
              "border border-border animate-in slide-in-from-right duration-200"
            )}
            role="alert"
          >
            <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
            <p className="text-sm text-text-primary flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 text-text-3 hover:text-text-primary transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
