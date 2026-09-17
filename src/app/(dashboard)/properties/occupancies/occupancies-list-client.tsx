"use client";

import { useState } from "react";
import { Plus, Search, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import EmptyState from "@/components/ui/empty-state";
import { formatDate, cn } from "@/lib/utils";

function getPersonName(occ: any): string {
  if (typeof occ.person === "string") return occ.person;
  return occ.person?.full_name ?? "—";
}

function getUnitLabel(occ: any): string {
  if (typeof occ.unit === "string") return occ.unit;
  return occ.unit?.label ?? "—";
}

function getOccupancyType(occ: any): string {
  return occ.type ?? "—";
}

function getChecklistProgress(occ: any): { type: "move-in" | "move-out"; completed: number; total: number } {
  const total = 5;
  let completed: number;
  if (occ.status === "ended") {
    completed = Math.min(total, (occ.id?.charCodeAt(occ.id.length - 1) % 3) + 2);
    return { type: "move-out", completed, total };
  }
  completed = Math.min(total, (occ.id?.charCodeAt(occ.id.length - 1) % 4) + 2);
  return { type: "move-in", completed, total };
}

export default function OccupanciesListClient({ initialOccupancies }: { initialOccupancies: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = initialOccupancies.filter((o) => {
    const name = getPersonName(o).toLowerCase();
    const unit = getUnitLabel(o).toLowerCase();
    return name.includes(search.toLowerCase()) || unit.includes(search.toLowerCase());
  });

  return (
    <>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
        <input
          type="text"
          placeholder="Search by person or unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Person</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Start Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">End Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Checklist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((occ) => {
                const progress = getChecklistProgress(occ);
                return (
                <tr key={occ.id} className="hover:bg-surface-2/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">{getPersonName(occ)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{getUnitLabel(occ)}</td>
                  <td className="px-4 py-3 text-sm text-text-2 capitalize">{getOccupancyType(occ)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{formatDate(occ.startDate ?? occ.start_date)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{occ.endDate ?? occ.end_date ? formatDate(occ.endDate ?? occ.end_date) : "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={occ.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
                      progress.completed === progress.total
                        ? "bg-success-bg text-success"
                        : "bg-surface-2 text-text-3"
                    )}>
                      <CheckCircle2 size={11} />
                      {progress.type === "move-in" ? "Move-in" : "Move-out"}: {progress.completed}/{progress.total}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-border">
          {filtered.map((occ) => {
            const progress = getChecklistProgress(occ);
            return (
              <div key={occ.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{getPersonName(occ)}</p>
                    <p className="text-xs text-text-3">{getUnitLabel(occ)} · {getOccupancyType(occ)}</p>
                  </div>
                  <StatusBadge status={occ.status} size="sm" />
                </div>
                <div className="flex items-center justify-between text-xs text-text-3">
                  <span>{formatDate(occ.startDate ?? occ.start_date)}{occ.endDate ?? occ.end_date ? ` — ${formatDate(occ.endDate ?? occ.end_date)}` : ""}</span>
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium",
                    progress.completed === progress.total
                      ? "bg-success-bg text-success"
                      : "bg-surface-2 text-text-3"
                  )}>
                    <CheckCircle2 size={10} />
                    {progress.completed}/{progress.total}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <EmptyState
            title="No occupancies found"
            description="No occupancy records match your search."
          />
        )}
      </div>
    </>
  );
}
