"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import Drawer from "@/components/ui/drawer";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import MoneyDisplay from "@/components/ui/money-display";
import EmptyState from "@/components/ui/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Invoice {
  id: string;
  number: string;
  unit: string;
  tenant: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  status: string;
  period: string;
}

export default function InvoiceListClient({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filtered = initialInvoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.tenant.toLowerCase().includes(search.toLowerCase()) ||
      inv.unit.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search invoices..."
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
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="overdue">Overdue</option>
          <option value="void">Void</option>
        </select>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Invoice #</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Tenant</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-2/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-text-primary font-tabular">{inv.number}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{inv.unit}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{inv.tenant}</td>
                  <td className="px-4 py-3 text-sm text-text-primary text-right font-tabular">{formatCurrency(inv.amount)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{formatDate(inv.dueDate)}</td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} size="sm" /></td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="text-sm text-gold hover:text-gold-dark transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <EmptyState
            title="No invoices found"
            description="No invoices match your search criteria."
            icon={<Plus size={24} />}
            action={<Button size="sm">Create Invoice</Button>}
          />
        )}
      </div>

      <InvoiceDetailDrawer invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
    </>
  );
}

function InvoiceDetailDrawer({
  invoice,
  onClose,
}: {
  invoice: Invoice | null;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={!!invoice}
      onClose={onClose}
      title={invoice?.number || ""}
      description={`${invoice?.unit} · ${invoice?.tenant}`}
      size="md"
    >
      {invoice && (
        <div className="space-y-6">
          <div>
            <StatusBadge status={invoice.status} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-3">Billing Period</span>
              <span className="text-text-primary font-medium">{invoice.period}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-3">Due Date</span>
              <span className="text-text-primary font-medium">{formatDate(invoice.dueDate)}</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-3">Amount Due</span>
              <MoneyDisplay amount={invoice.amount} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-3">Amount Paid</span>
              <MoneyDisplay amount={invoice.amountPaid} />
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-text-primary">Outstanding</span>
              <MoneyDisplay amount={invoice.amount - invoice.amountPaid} />
            </div>
          </div>

          {invoice.status !== "paid" && invoice.status !== "void" && (
            <div className="border-t border-border pt-4">
              <Button className="w-full">
                Record Payment
              </Button>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-text-primary mb-3">Payment History</h4>
            {invoice.amountPaid > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-2">Partial payment</span>
                  <MoneyDisplay amount={invoice.amountPaid} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-3">No payments recorded.</p>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
