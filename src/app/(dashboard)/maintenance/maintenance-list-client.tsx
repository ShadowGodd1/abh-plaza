"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import Drawer from "@/components/ui/drawer";
import EmptyState from "@/components/ui/empty-state";
import MoneyDisplay from "@/components/ui/money-display";
import { formatDate, formatCurrency, cn } from "@/lib/utils";

function getStatusLabel(status: string) {
  if (status === "in_progress") return "In Progress";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

interface MaintenanceRequest {
  id: string;
  issue: string;
  unit: string;
  raisedBy: string;
  date: string;
  status: string;
  cost: number | null;
}

export default function MaintenanceListClient({ initialRequests }: { initialRequests: MaintenanceRequest[] }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<MaintenanceRequest | null>(null);

  const filtered = initialRequests.filter((r) =>
    statusFilter === "all" || r.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
            <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-text-primary">Maintenance</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Maintenance</h1>
          <p className="text-sm text-text-3 mt-1">Track and manage maintenance requests.</p>
        </div>
        <Button>
          <Plus size={16} />
          Log Request
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "open", "in_progress", "resolved"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-full)] whitespace-nowrap transition-colors ${
              statusFilter === status
                ? "bg-gold text-ink"
                : "bg-surface-2 text-text-3 hover:text-text-primary"
            }`}
          >
            {status === "all" ? "All" : getStatusLabel(status)}
            <span className="ml-1.5 text-[10px]">
              {status === "all" ? initialRequests.length : initialRequests.filter((r) => r.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Status progression stepper */}
      {statusFilter !== "all" && (
        <StatusProgression activeStatus={statusFilter} />
      )}

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Issue</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Raised By</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-surface-2/30 transition-colors cursor-pointer"
                  onClick={() => setSelected(req)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">{req.issue}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{req.unit}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{req.raisedBy}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{formatDate(req.date)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {req.cost ? (
                      <MoneyDisplay amount={req.cost} />
                    ) : (
                      <span className="text-text-3">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-border">
          {filtered.map((req) => (
            <button
              key={req.id}
              onClick={() => setSelected(req)}
              className="w-full text-left p-4 space-y-1.5 hover:bg-surface-2/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary truncate pr-2">{req.issue}</span>
                <StatusBadge status={req.status} size="sm" />
              </div>
              <p className="text-sm text-text-2">{req.unit} · {req.raisedBy}</p>
              <p className="text-sm text-text-2">
                {formatDate(req.date)}
                {req.cost ? ` · ${formatCurrency(req.cost)}` : ""}
              </p>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <EmptyState
            title="No maintenance requests"
            description="All caught up! No requests to display."
            icon={<Plus size={24} />}
          />
        )}
      </div>

      {/* Detail drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Maintenance Request"
        size="md"
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Issue</p>
                <p className="text-sm text-text-primary">{selected.issue}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Unit</p>
                <p className="text-sm text-text-primary">{selected.unit}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Raised By</p>
                <p className="text-sm text-text-primary">{selected.raisedBy}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm text-text-primary">{formatDate(selected.date)}</p>
              </div>
            </div>

            {selected.cost && (
              <div className="border-t border-border pt-4">
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Cost</p>
                <MoneyDisplay amount={selected.cost} size="lg" />
                <p className="text-xs text-text-3 mt-1">Ledger entry will be created</p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}

const PROGRESS_STEPS = [
  { key: "open", label: "OPEN" },
  { key: "in_progress", label: "IN PROGRESS" },
  { key: "resolved", label: "RESOLVED" },
];

function StatusProgression({ activeStatus }: { activeStatus: string }) {
  const activeIndex = PROGRESS_STEPS.findIndex((s) => s.key === activeStatus);

  return (
    <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4">
      <div className="flex items-center justify-between">
        {PROGRESS_STEPS.map((step, i) => {
          const isCompleted = activeIndex > i;
          const isActive = step.key === activeStatus;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 transition-colors shrink-0",
                    isActive && "bg-gold border-gold",
                    isCompleted && "bg-green border-green",
                    !isActive && !isCompleted && "bg-surface-2 border-border"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium whitespace-nowrap",
                    isActive && "text-gold",
                    isCompleted && "text-green",
                    !isActive && !isCompleted && "text-text-3"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < PROGRESS_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 mt-[-18px] rounded-full",
                    activeIndex > i ? "bg-green" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
