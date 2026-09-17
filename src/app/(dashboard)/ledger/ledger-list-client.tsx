"use client";

import { useState, useMemo } from "react";
import MoneyDisplay from "@/components/ui/money-display";
import Drawer from "@/components/ui/drawer";
import EmptyState from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

function StatusBadge({ type }: { type: string }) {
  return (
    <span className={`text-xs font-medium ${type === "income" ? "text-success" : "text-danger"}`}>
      {type === "income" ? "Income" : "Expense"}
    </span>
  );
}

function getDateRange(dateFilter: string): { start: Date; end: Date } | null {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  switch (dateFilter) {
    case "this_month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: startOfDay(start), end: endOfDay(end) };
    }
    case "last_month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: startOfDay(start), end: endOfDay(end) };
    }
    case "this_quarter": {
      const quarter = Math.floor(now.getMonth() / 3);
      const start = new Date(now.getFullYear(), quarter * 3, 1);
      const end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
      return { start: startOfDay(start), end: endOfDay(end) };
    }
    default:
      return null;
  }
}

export default function LedgerListClient({ initialEntries }: { initialEntries: any[] }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = useMemo(() => {
    const dateRange = getDateRange(dateFilter);
    return initialEntries.filter((entry: any) => {
      const matchesType = typeFilter === "all" || entry.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || entry.category === categoryFilter;
      let matchesDate = true;
      if (dateRange) {
        const entryDate = new Date(entry.date || entry.occurred_at);
        matchesDate = entryDate >= dateRange.start && entryDate <= dateRange.end;
      }
      return matchesType && matchesCategory && matchesDate;
    });
  }, [initialEntries, typeFilter, categoryFilter, dateFilter]);

  const getRelatedRef = (entry: any) => {
    const desc = entry.description || "";
    const invMatch = desc.match(/INV-\d{4}-\d{4}/);
    if (invMatch) return invMatch[0];
    if (entry.category === "payroll") {
      const staffMatch = desc.match(/Payroll — (.+)/);
      return staffMatch ? staffMatch[1] : "Payroll";
    }
    return "—";
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Time</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="this_quarter">This Quarter</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Categories</option>
          <option value="rent">Rent</option>
          <option value="service_charge">Service Charge</option>
          <option value="utility">Utility</option>
          <option value="maintenance">Maintenance</option>
          <option value="payroll">Payroll</option>
          <option value="deposit">Deposit</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Description</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Related</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Income</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Expense</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((entry: any) => (
                <tr
                  key={entry.id}
                  className="hover:bg-surface-2/30 transition-colors cursor-pointer"
                  onClick={() => setSelected(entry)}
                >
                  <td className="px-4 py-3 text-sm text-text-2">{formatDate(entry.date || entry.occurred_at)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge type={entry.type} />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-2 capitalize">{entry.category.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{entry.description}</td>
                  <td className="px-4 py-3 text-sm text-text-2 font-tabular">{getRelatedRef(entry)}</td>
                  <td className="px-4 py-3 text-sm text-right font-tabular">
                    {entry.type === "income" ? (
                      <MoneyDisplay amount={entry.amount} className="text-success" />
                    ) : (
                      <span className="text-text-3">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-tabular">
                    {entry.type === "expense" ? (
                      <MoneyDisplay amount={entry.amount} className="text-danger" />
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
          {filtered.map((entry: any) => (
            <button
              key={entry.id}
              onClick={() => setSelected(entry)}
              className="w-full text-left p-4 space-y-1.5 hover:bg-surface-2/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <StatusBadge type={entry.type} />
                <span className="text-xs text-text-3">{formatDate(entry.date || entry.occurred_at)}</span>
              </div>
              <p className="text-sm font-medium text-text-primary">{entry.description}</p>
              <p className="text-sm text-text-2 capitalize">{entry.category.replace("_", " ")}</p>
              <p className="text-xs text-text-3">Related: {getRelatedRef(entry)}</p>
              <p className="text-sm font-tabular">
                {entry.type === "income" ? (
                  <MoneyDisplay amount={entry.amount} className="text-success" />
                ) : (
                  <MoneyDisplay amount={entry.amount} className="text-danger" />
                )}
              </p>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <EmptyState
            title="No ledger entries"
            description="Financial entries will appear here."
          />
        )}
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Ledger Entry"
        size="md"
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <StatusBadge type={selected.type} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Date</span>
                <span className="text-text-primary font-medium">{formatDate(selected.date || selected.occurred_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Category</span>
                <span className="text-text-primary font-medium capitalize">{selected.category.replace("_", " ")}</span>
              </div>
              <div>
                <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-text-primary">{selected.description}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Related</span>
                <span className="text-text-primary font-medium font-tabular">{getRelatedRef(selected)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-text-primary">Amount</span>
                <MoneyDisplay
                  amount={selected.amount}
                  size="lg"
                  className={selected.type === "income" ? "text-success" : "text-danger"}
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
