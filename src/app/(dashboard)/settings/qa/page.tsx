"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "abh-design-qa";

const checklistItems = [
  "All colors use design tokens",
  "All spacing uses 8px grid",
  "All text uses correct ink colors",
  "All interactive elements have hover state",
  "All interactive elements have focus state",
  "All buttons have loading state",
  "All lists have empty state",
  "All data views have loading skeleton",
  "All forms have validation",
  "All destructive actions have confirmation",
  "Mobile responsive at 390px",
  "Tablet responsive at 768px",
  "Desktop responsive at 1280px",
  "Keyboard navigation works",
  "Screen reader labels present",
  "Print layout works",
  "Animations respect prefers-reduced-motion",
];

export default function DesignQAPage() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setChecked(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    }
  }, [checked, mounted]);

  const toggle = (idx: number) => {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = checklistItems.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/settings"
          className="flex items-center gap-1.5 text-sm text-text-3 hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Settings
        </Link>
        <div className="h-5 w-px bg-border" />
        <h1 className="text-2xl font-semibold text-text-primary">Design QA Checklist</h1>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Progress</span>
          <span className="text-sm text-text-3">
            {completedCount} / {totalCount} completed
          </span>
        </div>
        <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-success rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border divide-y divide-border">
        {checklistItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => toggle(idx)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-2/50 transition-colors text-left"
          >
            {checked[idx] ? (
              <CheckCircle size={18} className="text-success flex-shrink-0" />
            ) : (
              <Circle size={18} className="text-text-3 flex-shrink-0" />
            )}
            <span
              className={cn(
                "text-sm",
                checked[idx] ? "text-text-3 line-through" : "text-text-primary"
              )}
            >
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
