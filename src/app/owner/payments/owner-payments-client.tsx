"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/status-badge";

interface Payment {
  id: string;
  invoiceNumber: string;
  tenant: string;
  unit: string;
  amount: number;
  method: string;
  receipt: string | null;
  date: string;
  status: string;
}

interface OwnerPaymentsClientProps {
  payments: Payment[];
  ownerName: string;
  unitLabel: string;
}

const invoices = [
  { id: "1", number: "INV-2026-0010", amount: 500000, dueDate: "2026-09-30", status: "paid" },
  { id: "2", number: "INV-2026-0008", amount: 500000, dueDate: "2026-08-30", status: "paid" },
];

const paymentHistory = [
  { month: "Sep 2026", amount: 500000, receipt: "SCS7Y2K9AB", status: "completed" },
  { month: "Aug 2026", amount: 500000, receipt: "DEF456GHI", status: "completed" },
  { month: "Jul 2026", amount: 500000, receipt: "JKL789MNO", status: "completed" },
];

export default function OwnerPaymentsClient({ payments, ownerName, unitLabel }: OwnerPaymentsClientProps) {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-text-primary mb-1">Payments</h1>
      <p className="text-sm text-text-3 mb-6">Service charge invoices and payment history.</p>

      <div className="mb-6">
        <h2 className="text-sm font-medium text-text-primary mb-3">Invoices</h2>
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary font-tabular">{inv.number}</span>
              <StatusBadge status={inv.status} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-text-primary font-tabular">{formatCurrency(inv.amount)}</p>
                <p className="text-xs text-text-3">Due {formatDate(inv.dueDate)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium text-text-primary mb-3">Payment History</h2>
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border divide-y divide-border">
          {paymentHistory.map((p) => (
            <div key={p.month} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-text-2">{p.month}</p>
                <p className="text-xs text-text-3 font-tabular">Receipt: {p.receipt}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary font-tabular">{formatCurrency(p.amount)}</p>
                <StatusBadge status={p.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
