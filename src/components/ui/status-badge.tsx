"use client";

import { useEffect, useRef } from "react";
import { cn, getStatusColor, getStatusLabel } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export default function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const colors = getStatusColor(status);
  const label = getStatusLabel(status);
  const prevStatusRef = useRef(status);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prevStatusRef.current !== status && badgeRef.current) {
      badgeRef.current.classList.remove("status-change");
      void badgeRef.current.offsetWidth;
      badgeRef.current.classList.add("status-change");
    }
    prevStatusRef.current = status;
  }, [status]);

  return (
    <span
      ref={badgeRef}
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-[var(--radius-full)]",
        colors.bg,
        colors.text,
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-xs": size === "md",
        },
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", colors.dot)} />
      {label}
    </span>
  );
}
