"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { LayoutGrid, List, Search } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { cn, formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";

interface Unit {
  id: string;
  label: string;
  type: string;
  floor: number;
  status: string;
  tenant: string | null;
  rent: number;
}

function formatFloor(floor: number): string {
  if (floor === 0) return "Ground";
  const suffix = floor === 1 ? "st" : floor === 2 ? "nd" : floor === 3 ? "rd" : "th";
  return `${floor}${suffix}`;
}

function StatusBadge({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) {
  const colors = getStatusColor(status);
  const label = getStatusLabel(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-[var(--radius-full)]",
        colors.bg,
        colors.text,
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-xs": size === "md",
        }
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
      {label}
    </span>
  );
}

export default function UnitsListClient({ initialUnits }: { initialUnits: Unit[] }) {
  const [view, setView] = useState<"grid" | "table">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUnits = useMemo(() => {
    return initialUnits.filter((unit) => {
      const matchesSearch =
        unit.label.toLowerCase().includes(search.toLowerCase()) ||
        (unit.tenant && unit.tenant.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === "all" || unit.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialUnits, search, statusFilter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search units or tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Status</option>
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
          <option value="under_maintenance">Under Maintenance</option>
          <option value="reserved">Reserved</option>
        </select>
        <div className="flex items-center gap-1 bg-surface border border-border rounded-[var(--radius-md)] p-0.5">
          <button
            onClick={() => setView("table")}
            className={cn(
              "w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center transition-colors",
              view === "table" ? "bg-surface-2 text-text-primary" : "text-text-3 hover:text-text-primary"
            )}
            aria-label="Table view"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView("grid")}
            className={cn(
              "w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center transition-colors",
              view === "grid" ? "bg-surface-2 text-text-primary" : "text-text-3 hover:text-text-primary"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {view === "table" && (
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-2/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Unit</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Floor</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Tenant</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Rent</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-surface-2/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-text-primary">{unit.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-2">{unit.type}</td>
                    <td className="px-4 py-3 text-sm text-text-2">{formatFloor(unit.floor)}</td>
                    <td className="px-4 py-3"><StatusBadge status={unit.status} size="sm" /></td>
                    <td className="px-4 py-3 text-sm text-text-2">{unit.tenant || "\u2014"}</td>
                    <td className="px-4 py-3 text-sm text-text-primary text-right font-tabular">
                      {unit.rent > 0 ? formatCurrency(unit.rent) : "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/properties/units?id=${unit.id}`}
                        className="text-sm text-gold hover:text-gold-dark transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUnits.length === 0 && (
            <EmptyState
              title="No units found"
              description="No units match your search criteria."
              icon={<LayoutGrid size={24} />}
            />
          )}
        </div>
      )}

      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => (
            <Link
              key={unit.id}
              href={`/properties/units?id=${unit.id}`}
              className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 hover:shadow-[var(--shadow-card)] transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-lg font-semibold text-text-primary">{unit.label}</span>
                <StatusBadge status={unit.status} size="sm" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-text-2">{unit.type}</p>
                <p className="text-sm text-text-3">{unit.floor === 0 ? "Ground Floor" : `${formatFloor(unit.floor)} Floor`}</p>
                {unit.tenant && (
                  <p className="text-sm text-text-2 mt-2 pt-2 border-t border-border">{unit.tenant}</p>
                )}
                {unit.rent > 0 && (
                  <p className="text-sm font-medium text-text-primary font-tabular mt-1">
                    {formatCurrency(unit.rent)} / month
                  </p>
                )}
              </div>
            </Link>
          ))}
          {filteredUnits.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                title="No units found"
                description="No units match your search criteria."
                icon={<LayoutGrid size={24} />}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
