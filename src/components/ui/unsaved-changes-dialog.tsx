"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./button";

function useUnsavedChanges(hasChanges: boolean) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [isPushing, setIsPushing] = useState(false);

  // Store original push/replace
  const pushRef = useRef(router.push);

  useEffect(() => {
    pushRef.current = router.push;
  }, [router.push]);

  // beforeunload handler
  useEffect(() => {
    if (!hasChanges) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  const interceptNavigation = useCallback(
    (navigationFn: () => void) => {
      if (!hasChanges) {
        navigationFn();
        return;
      }
      setPendingNavigation(() => navigationFn);
      setShowDialog(true);
    },
    [hasChanges]
  );

  const handleStay = useCallback(() => {
    setShowDialog(false);
    setPendingNavigation(null);
  }, []);

  const handleLeave = useCallback(() => {
    setShowDialog(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  }, [pendingNavigation]);

  const push = useCallback(
    (href: string) => {
      interceptNavigation(() => pushRef.current(href));
    },
    [interceptNavigation]
  );

  return {
    showDialog,
    handleStay,
    handleLeave,
    push,
    interceptNavigation,
  };
}

export { useUnsavedChanges };

interface UnsavedChangesDialogProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export default function UnsavedChangesDialog({
  open,
  onStay,
  onLeave,
}: UnsavedChangesDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onStay();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onStay]);

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
        aria-labelledby="unsaved-title"
        aria-describedby="unsaved-desc"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-warning-bg flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-warning" />
          </div>
          <div>
            <h2 id="unsaved-title" className="text-base font-semibold text-text-primary">
              Unsaved Changes
            </h2>
            <p id="unsaved-desc" className="text-sm text-text-3 mt-1">
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onStay}>
            Stay
          </Button>
          <Button variant="danger" onClick={onLeave}>
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
}
