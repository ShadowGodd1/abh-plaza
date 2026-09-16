import Link from "next/link";
import { getLedgerEntries } from "@/lib/data";
import MoneyDisplay from "@/components/ui/money-display";
import EmptyState from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import LedgerListClient from "./ledger-list-client";

export default async function LedgerPage() {
  const entries = await getLedgerEntries();

  const totalIncome = entries
    .filter((e: any) => e.type === "income")
    .reduce((sum: number, e: any) => sum + e.amount, 0);
  const totalExpense = entries
    .filter((e: any) => e.type === "expense")
    .reduce((sum: number, e: any) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-text-primary">Ledger</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Ledger</h1>
        <p className="text-sm text-text-3 mt-1">Financial record of all income and expenses.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4">
          <p className="text-sm text-text-3">Total Income</p>
          <MoneyDisplay amount={totalIncome} size="lg" className="text-success mt-1" />
        </div>
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4">
          <p className="text-sm text-text-3">Total Expenses</p>
          <MoneyDisplay amount={totalExpense} size="lg" className="text-danger mt-1" />
        </div>
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4">
          <p className="text-sm text-text-3">Net</p>
          <MoneyDisplay amount={totalIncome - totalExpense} size="lg" className="mt-1" />
        </div>
      </div>

      <LedgerListClient initialEntries={entries} />
    </div>
  );
}
