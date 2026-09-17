"use client";

import { AlertTriangle } from "lucide-react";
import Button from "./button";

interface ConflictBannerProps {
  modifiedBy: string;
  modifiedAt: string;
  onOverwrite?: () => void;
  onViewChanges?: () => void;
}

export default function ConflictBanner({
  modifiedBy,
  modifiedAt,
  onOverwrite,
  onViewChanges,
}: ConflictBannerProps) {
  return (
    <div className="bg-warning-bg border border-warning/20 rounded-[var(--radius-md)] p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle size={16} className="text-warning" />
        </div>
        <p className="text-sm text-text-primary">
          This record was changed by <span className="font-medium">{modifiedBy}</span> at{" "}
          <span className="font-medium">{modifiedAt}</span>. Your changes may conflict.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="secondary" size="sm" onClick={onViewChanges}>
          View Changes
        </Button>
        <Button
          size="sm"
          className="bg-gold text-ink hover:bg-gold-light"
          onClick={onOverwrite}
        >
          Overwrite
        </Button>
      </div>
    </div>
  );
}
