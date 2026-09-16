"use client";

import { useState, useMemo } from "react";
import MoneyDisplay from "@/components/ui/money-display";
import EmptyState from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

function StatusBadge({ type }: { type: string }) {
  return (
    <span className={`text-xs font-medium ${type === "income" ? "text-success" : "text-danger"}`}>
      {type === "income" ? "Income" : "Expense"}
    </span>
  );
}

export default function LedgerListClient({ initialEntries }: { initialEntries: any[] }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    return initialEntries.filter((entry: any) => {
      const matchesType = typeFilter === "all" || entry.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || entry.category === categoryFilter;
      return matchesType && matchesCategory;
    });
  }, [initialEntries, typeFilter, categoryFilter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Description</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Income</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Expense</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((entry: any) => (
                <tr key={entry.id} className="hover:bg-surface-2/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-text-2">{formatDate(entry.date || entry.occurred_at)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge type={entry.type} />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-2 capitalize">{entry.category.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{entry.description}</td>
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
        {filtered.length === 0 && (
          <EmptyState
            title="No ledger entries"
            description="Financial entries will appear here."
          />
        )}
      </div>
    </>
  );
}
