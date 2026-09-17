"use client";

import { useState, useEffect } from "react";
import { X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "abh-demo-banner-dismissed";

export default function DemoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "true");
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "bg-warning/10 border-b border-warning/20 px-4 py-2.5 flex items-center justify-between gap-3",
        "text-sm text-warning"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Info size={16} className="flex-shrink-0" />
        <span className="truncate">
          <span className="font-medium">Demo Mode</span> — Using sample data. Connect Supabase for real data.
        </span>
      </div>
      <button
        onClick={dismiss}
        className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-warning/60 hover:text-warning hover:bg-warning/10 transition-colors"
        aria-label="Dismiss demo banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
