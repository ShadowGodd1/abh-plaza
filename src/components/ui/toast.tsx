"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_VISIBLE = 3;
const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 5000,
  error: 8000,
  warning: 5000,
  info: 5000,
};

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-success" />,
  error: <XCircle size={16} className="text-danger" />,
  warning: <AlertTriangle size={16} className="text-warning" />,
  info: <Info size={16} className="text-info" />,
};

const BG_COLORS: Record<ToastType, string> = {
  success: "border-success/20 bg-success-bg",
  error: "border-danger/20 bg-danger-bg",
  warning: "border-warning/20 bg-warning-bg",
  info: "border-info/20 bg-info-bg",
};

let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, duration?: number) => {
      const id = `toast-${++toastCounter}`;
      const dur = duration ?? DEFAULT_DURATIONS[type];
      const newToast: Toast = { id, type, message, duration: dur };

      setToasts((prev) => {
        const next = [newToast, ...prev];
        return next.length > MAX_VISIBLE ? next.slice(0, MAX_VISIBLE) : next;
      });

      const timer = setTimeout(() => removeToast(id), dur);
      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <>
      {/* Desktop: top-right */}
      <div className="hidden sm:fixed sm:top-4 sm:right-4 sm:z-[100] sm:flex sm:flex-col sm:gap-2 sm:w-80">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </div>
      {/* Mobile: bottom */}
      <div className="fixed bottom-4 left-4 right-4 z-[100] flex flex-col gap-2 sm:hidden">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </div>
    </>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-[var(--radius-md)] border shadow-[var(--shadow-dropdown)]",
        "animate-[toast-slide-in_0.2s_ease-out]",
        BG_COLORS[toast.type]
      )}
    >
      <span className="mt-0.5 shrink-0">{ICONS[toast.type]}</span>
      <p className="text-sm text-text-primary flex-1 min-w-0">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-text-3 hover:text-text-primary transition-colors mt-0.5"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
