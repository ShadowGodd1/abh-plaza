"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import Drawer from "@/components/ui/drawer";
import MoneyDisplay from "@/components/ui/money-display";
import EmptyState from "@/components/ui/empty-state";
import { formatDate, formatCurrency } from "@/lib/utils";

const methodLabels: Record<string, string> = {
  mpesa_stk: "M-Pesa STK",
  mpesa_c2b: "M-Pesa C2B",
  cash: "Cash",
  bank: "Bank Transfer",
};

interface Payment {
  id: string;
  paid_at?: string;
  date?: string;
  invoice?: {
    invoice_number: string;
    occupancy?: {
      person?: { full_name: string };
      unit?: { label: string };
    };
  };
  invoiceNumber?: string;
  tenant?: string;
  unit?: string;
  amount: number;
  method: string;
  receipt_number?: string | null;
  receipt?: string | null;
  status: string;
}

function getInvoiceNumber(p: Payment): string {
  return p.invoice?.invoice_number ?? p.invoiceNumber ?? "—";
}

function getTenant(p: Payment): string {
  return p.invoice?.occupancy?.person?.full_name ?? p.tenant ?? "—";
}

function getUnit(p: Payment): string {
  return p.invoice?.occupancy?.unit?.label ?? p.unit ?? "—";
}

function getReceipt(p: Payment): string {
  return p.receipt_number ?? p.receipt ?? "—";
}

function getDate(p: Payment): string {
  return p.paid_at ?? p.date ?? "";
}

export default function PaymentListClient({ initialPayments }: { initialPayments: Payment[] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Payment | null>(null);

  const filteredPayments = useMemo(() => {
    if (!search.trim()) return initialPayments;
    const q = search.toLowerCase();
    return initialPayments.filter((p) => {
      return (
        getTenant(p).toLowerCase().includes(q) ||
        getUnit(p).toLowerCase().includes(q) ||
        getReceipt(p).toLowerCase().includes(q) ||
        getInvoiceNumber(p).toLowerCase().includes(q)
      );
    });
  }, [initialPayments, search]);

  return (
    <>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
        <input
          type="text"
          placeholder="Search by receipt, tenant, or unit..."
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
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Tenant</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Unit</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Method</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Receipt</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-surface-2/30 transition-colors cursor-pointer"
                  onClick={() => setSelected(payment)}
                >
                  <td className="px-4 py-3 text-sm text-text-2">{formatDate(getDate(payment))}</td>
                  <td className="px-4 py-3 text-sm font-medium text-text-primary font-tabular">{getInvoiceNumber(payment)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{getTenant(payment)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{getUnit(payment)}</td>
                  <td className="px-4 py-3 text-sm text-text-primary text-right font-tabular">{formatCurrency(payment.amount)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{methodLabels[payment.method] ?? payment.method}</td>
                  <td className="px-4 py-3 text-sm text-text-3 font-tabular">{getReceipt(payment)}</td>
                  <td className="px-4 py-3"><StatusBadge status={payment.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-border">
          {filteredPayments.map((payment) => (
            <button
              key={payment.id}
              onClick={() => setSelected(payment)}
              className="w-full text-left p-4 space-y-1.5 hover:bg-surface-2/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary font-tabular">{getInvoiceNumber(payment)}</span>
                <StatusBadge status={payment.status} size="sm" />
              </div>
              <p className="text-sm text-text-2">{getTenant(payment)} · {getUnit(payment)}</p>
              <p className="text-sm text-text-2">
                {formatCurrency(payment.amount)} · {methodLabels[payment.method] ?? payment.method}
              </p>
            </button>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <EmptyState
            title="No payments recorded"
            description="Payments will appear here once recorded."
          />
        )}
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Payment Details"
        size="md"
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Amount</span>
                <MoneyDisplay amount={selected.amount} size="lg" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Invoice</span>
                <span className="text-text-primary font-medium font-tabular">{getInvoiceNumber(selected)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Tenant</span>
                <span className="text-text-primary font-medium">{getTenant(selected)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Unit</span>
                <span className="text-text-primary font-medium">{getUnit(selected)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Method</span>
                <span className="text-text-primary font-medium">{methodLabels[selected.method] ?? selected.method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Receipt</span>
                <span className="text-text-primary font-medium font-tabular">{getReceipt(selected)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Date</span>
                <span className="text-text-primary font-medium">{formatDate(getDate(selected))}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
