"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import Drawer from "@/components/ui/drawer";
import EmptyState from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

function getName(a: any): string {
  if (typeof a.name === "string") return a.name;
  if (typeof a.person === "string") return a.person;
  return a.person?.full_name ?? a.name ?? "—";
}

function getPhone(a: any): string {
  if (a.phone) return a.phone;
  return a.person?.phone ?? "—";
}

function getUnit(a: any): string {
  if (typeof a.unit === "string") return a.unit;
  return a.unit?.label ?? "—";
}

function getStatusCounts(applicants: any[]) {
  const counts: Record<string, number> = {};
  for (const a of applicants) {
    const s = a.status;
    counts[s] = (counts[s] || 0) + 1;
  }
  return counts;
}

export default function ApplicantsListClient({ initialApplicants }: { initialApplicants: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);

  const counts = getStatusCounts(initialApplicants);

  const filtered = initialApplicants.filter((a) => {
    const name = getName(a).toLowerCase();
    const unit = getUnit(a).toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || unit.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Pipeline status */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["inquired", "viewing", "approved", "rejected", "converted"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-full)] whitespace-nowrap transition-colors ${
              statusFilter === status
                ? "bg-gold text-ink"
                : "bg-surface-2 text-text-3 hover:text-text-primary"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1.5 text-[10px]">
              {counts[status] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
        <input
          type="text"
          placeholder="Search by name or unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="hover:bg-surface-2/30 transition-colors cursor-pointer"
                  onClick={() => setSelected(applicant)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">{getName(applicant)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{getPhone(applicant)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{getUnit(applicant)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{formatDate(applicant.date ?? applicant.created_at)}</td>
                  <td className="px-4 py-3"><StatusBadge status={applicant.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <EmptyState
            title="No applicants found"
            description="No applicants match your criteria."
          />
        )}
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Applicant Details"
        size="md"
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Name</p>
                <p className="text-sm font-medium text-text-primary">{getName(selected)}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm text-text-primary">{getPhone(selected)}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Interested Unit</p>
                <p className="text-sm text-text-primary">{getUnit(selected)}</p>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm text-text-primary">{formatDate(selected.date ?? selected.created_at)}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-text-3 uppercase tracking-wider mb-3">Actions</p>
              <div className="flex gap-2">
                {selected.status !== "approved" && selected.status !== "rejected" && selected.status !== "converted" && (
                  <>
                    <Button size="sm" className="flex-1">Approve</Button>
                    <Button size="sm" variant="secondary" className="flex-1">Reject</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
