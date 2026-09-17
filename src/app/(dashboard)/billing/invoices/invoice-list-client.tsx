"use client";

import { useState, useMemo } from "react";
import { Search, Plus, AlertTriangle, FileText, Download, Upload } from "lucide-react";
import Drawer from "@/components/ui/drawer";
import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import MoneyDisplay from "@/components/ui/money-display";
import EmptyState from "@/components/ui/empty-state";
import Modal from "@/components/ui/modal";
import { useUnsavedChanges } from "@/components/ui/unsaved-changes-dialog";
import UnsavedChangesDialog from "@/components/ui/unsaved-changes-dialog";
import { formatCurrency, formatDate, formatDateRelative } from "@/lib/utils";
import { DEMO_PAYMENTS } from "@/lib/demo-data";

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
  lastModified?: { date: string; user: string };
}

function getPeriodDates(period: string): { start: Date; end: Date } | null {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (period === "this_month") {
    return { start: new Date(year, month, 1), end: new Date(year, month + 1, 0) };
  }
  if (period === "last_month") {
    return { start: new Date(year, month - 1, 1), end: new Date(year, month, 0) };
  }
  if (period === "this_quarter") {
    const quarterStart = Math.floor(month / 3) * 3;
    return { start: new Date(year, quarterStart, 1), end: new Date(year, quarterStart + 3, 0) };
  }
  return null;
}

export default function InvoiceListClient({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filtered = initialInvoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.tenant.toLowerCase().includes(search.toLowerCase()) ||
      inv.unit.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;

    let matchesPeriod = true;
    if (periodFilter !== "all") {
      const range = getPeriodDates(periodFilter);
      if (range) {
        const due = new Date(inv.dueDate);
        matchesPeriod = due >= range.start && due <= range.end;
      }
    }

    return matchesSearch && matchesStatus && matchesPeriod;
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
        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Periods</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="this_quarter">This Quarter</option>
        </select>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
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
                <tr
                  key={inv.id}
                  className={`transition-colors ${
                    inv.status === "overdue"
                      ? "bg-danger/[0.03] hover:bg-danger/[0.06]"
                      : "hover:bg-surface-2/30"
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-text-primary font-tabular">{inv.number}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{inv.unit}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{inv.tenant}</td>
                  <td className="px-4 py-3 text-sm text-text-primary text-right font-tabular">{formatCurrency(inv.amount)}</td>
                  <td className={`px-4 py-3 text-sm ${inv.status === "overdue" ? "text-danger font-medium" : "text-text-2"}`}>
                    {formatDate(inv.dueDate)}
                  </td>
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

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-border">
          {filtered.map((inv) => (
            <button
              key={inv.id}
              onClick={() => setSelectedInvoice(inv)}
              className={`w-full text-left p-4 space-y-1.5 transition-colors ${
                inv.status === "overdue"
                  ? "bg-danger/[0.03] hover:bg-danger/[0.06]"
                  : "hover:bg-surface-2/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary font-tabular">{inv.number}</span>
                <StatusBadge status={inv.status} size="sm" />
              </div>
              <p className="text-sm text-text-2">{inv.unit} · {inv.tenant}</p>
              <p className="text-sm text-text-2">
                {formatCurrency(inv.amount)} · Due {formatDate(inv.dueDate)}
              </p>
            </button>
          ))}
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
  const [recordPaymentLoading, setRecordPaymentLoading] = useState(false);
  const [voidLoading, setVoidLoading] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("M-Pesa STK");

  const hasPaymentChanges = useMemo(() => {
    return !!(paymentRef || paymentNotes || paymentMethod !== "M-Pesa STK");
  }, [paymentRef, paymentNotes, paymentMethod]);

  const { showDialog: showPaymentUnsaved, handleStay: stayPayment, handleLeave: leavePayment } = useUnsavedChanges(hasPaymentChanges && showPaymentConfirm);

  const payments = invoice
    ? DEMO_PAYMENTS.filter((p) => p.invoiceNumber === invoice.number)
    : [];

  const auditEntries = invoice
    ? [
        { action: "Invoice created by Admin", timestamp: "Sep 1, 2026 · 8:00 AM", color: "bg-text-3" },
        ...(invoice.amountPaid > 0
          ? [{ action: `Payment recorded — ${formatCurrency(invoice.amountPaid)}`, timestamp: "Sep 14, 2026 · 2:15 PM", color: "bg-gold" }]
          : []),
        ...(invoice.status === "paid"
          ? [{ action: "Status changed to Paid", timestamp: "Sep 14, 2026 · 2:16 PM", color: "bg-green" }]
          : invoice.status === "partial"
            ? [{ action: "Status changed to Partial", timestamp: "Sep 14, 2026 · 2:16 PM", color: "bg-gold" }]
            : invoice.status === "overdue"
              ? [{ action: "Status changed to Overdue", timestamp: "Sep 11, 2026 · 12:00 AM", color: "bg-red" }]
              : []),
      ]
    : [];

  const handleRecordPayment = async () => {
    setRecordPaymentLoading(true);
    setShowPaymentConfirm(false);
    setPaymentRef("");
    setPaymentNotes("");
    setPaymentMethod("M-Pesa STK");
    try {
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setRecordPaymentLoading(false);
    }
  };

  const handleClosePayment = () => {
    if (hasPaymentChanges) {
      leavePayment();
      setShowPaymentConfirm(false);
      setPaymentRef("");
      setPaymentNotes("");
      setPaymentMethod("M-Pesa STK");
    } else {
      setShowPaymentConfirm(false);
    }
  };

  const handleVoidInvoice = async () => {
    setVoidLoading(true);
    setShowVoidConfirm(false);
    try {
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setVoidLoading(false);
    }
  };

  const outstanding = invoice ? invoice.amount - invoice.amountPaid : 0;
  const isOverpaid = invoice ? invoice.amountPaid > invoice.amount : false;
  const isPartial = invoice ? invoice.amountPaid > 0 && invoice.amountPaid < invoice.amount : false;
  const creditAmount = isOverpaid && invoice ? invoice.amountPaid - invoice.amount : 0;

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
              <span className={`font-medium ${invoice.status === "overdue" ? "text-danger" : "text-text-primary"}`}>
                {formatDate(invoice.dueDate)}
              </span>
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
              {isOverpaid ? (
                <span className="text-success font-medium">KES 0</span>
              ) : (
                <MoneyDisplay amount={outstanding} />
              )}
            </div>
          </div>

          {isOverpaid && (
            <div className="bg-success-bg border border-success/20 rounded-[var(--radius-md)] px-4 py-3">
              <p className="text-sm font-medium text-success">
                KES {creditAmount.toLocaleString("en-KE")} credit
              </p>
              <p className="text-xs text-success/80 mt-0.5">
                Overpayment of {formatCurrency(creditAmount)} will be applied to future invoices.
              </p>
            </div>
          )}

          {isPartial && (
            <div className="bg-warning-bg border border-warning/20 rounded-[var(--radius-md)] px-4 py-3">
              <p className="text-sm font-medium text-warning">
                Remaining Balance: {formatCurrency(outstanding)}
              </p>
              <p className="text-xs text-warning/80 mt-0.5">
                {formatCurrency(invoice.amountPaid)} of {formatCurrency(invoice.amount)} paid.
              </p>
            </div>
          )}

          {invoice.status !== "paid" && invoice.status !== "void" && (
            <div className="border-t border-border pt-4 sticky bottom-0 bg-surface pb-6">
              <Button
                className="w-full"
                loading={recordPaymentLoading}
                onClick={() => setShowPaymentConfirm(true)}
              >
                Record Payment
              </Button>
            </div>
          )}

          {invoice.status !== "void" && invoice.status !== "paid" && (
            <div>
              <Button
                variant="danger"
                className="w-full"
                loading={voidLoading}
                onClick={() => setShowVoidConfirm(true)}
              >
                Void Invoice
              </Button>
            </div>
          )}

          {/* Payment History */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-text-primary mb-3">Payment History</h4>
            {payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="bg-surface-2/50 rounded-[var(--radius-md)] p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary font-tabular">{formatCurrency(p.amount)}</span>
                      <span className="text-xs text-text-3">{formatDate(p.date)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-3">
                      <span className="capitalize">{p.method.replace("_", " ")}</span>
                      {p.receipt && <span className="font-tabular">Ref: {p.receipt}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-3">No payments recorded.</p>
            )}
          </div>

          {/* Documents */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-text-primary mb-3">Documents</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-surface-2/50 rounded-[var(--radius-md)] p-3 group">
                <div className="w-8 h-8 rounded bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{invoice.number}.pdf</p>
                  <p className="text-xs text-text-3">245 KB</p>
                </div>
                <button className="text-text-3 hover:text-gold transition-colors opacity-0 group-hover:opacity-100" aria-label="Download document">
                  <Download size={14} />
                </button>
              </div>
            </div>
            <button className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold-dark transition-colors">
              <Upload size={12} />
              Attach File
            </button>
          </div>

          {/* Audit History */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-text-primary mb-3">Audit History</h4>
            <div className="space-y-3">
              {auditEntries.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full ${entry.color} mt-1.5 shrink-0`} />
                  <div>
                    <p className="text-sm text-text-primary">{entry.action}</p>
                    <p className="text-xs text-text-3 mt-0.5">{entry.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Last Modified Indicator */}
          {invoice.lastModified && (
            <div className="border-t border-border pt-4 mt-2">
              <p className="text-xs text-text-3">
                Last modified: {formatDateRelative(invoice.lastModified.date)} by{" "}
                <span className="font-medium text-text-2">{invoice.lastModified.user}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Record Payment Confirmation */}
      <UnsavedChangesDialog open={showPaymentUnsaved} onStay={stayPayment} onLeave={() => { leavePayment(); setShowPaymentConfirm(false); setPaymentRef(""); setPaymentNotes(""); setPaymentMethod("M-Pesa STK"); }} />
      <Modal
        open={showPaymentConfirm}
        onClose={handleClosePayment}
        title="Record Payment"
        size="md"
      >
        {invoice && (
          <div className="space-y-4">
            <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Unit</span>
                <span className="text-text-primary font-medium">{invoice.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Tenant</span>
                <span className="text-text-primary font-medium">{invoice.tenant}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Invoice</span>
                <span className="text-text-primary font-medium font-tabular">{invoice.number}</span>
              </div>
              <div className="border-t border-border" />
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Invoice Amount</span>
                <span className="text-text-primary font-medium font-tabular">{formatCurrency(invoice.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Outstanding</span>
                <span className="text-text-primary font-medium font-tabular">{formatCurrency(invoice.amount - invoice.amountPaid)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-3 uppercase tracking-wider block mb-1.5">Payment Amount</label>
                <input
                  type="text"
                  defaultValue={formatCurrency(invoice.amount - invoice.amountPaid)}
                  className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold font-tabular"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-text-3 uppercase tracking-wider block mb-1.5">Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option>M-Pesa STK</option>
                  <option>M-Pesa C2B</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
                <div>
                  <label className="text-xs font-medium text-text-3 uppercase tracking-wider block mb-1.5">Date</label>
                  <input
                    type="text"
                    defaultValue={new Date().toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                    className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-text-3 uppercase tracking-wider block mb-1.5">Reference / Transaction ID</label>
                <input
                  type="text"
                  placeholder="e.g. QHK4X7B2RT"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-3 uppercase tracking-wider block mb-1.5">Notes</label>
                <textarea
                  placeholder="Optional notes..."
                  rows={2}
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={handleClosePayment}>
                Cancel
              </Button>
              <Button loading={recordPaymentLoading} onClick={handleRecordPayment}>
                Record Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Void Invoice Confirmation */}
      <Modal
        open={showVoidConfirm}
        onClose={() => setShowVoidConfirm(false)}
        title="Void Invoice"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-danger" />
            </div>
            <div>
              <p className="text-sm text-text-primary">
                You are about to void Invoice{" "}
                <span className="font-medium">{invoice?.number}</span>.
              </p>
              <p className="text-sm text-amber-700 mt-1">
                This action cannot be undone. The invoice will be marked as void and no further payments can be recorded against it.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowVoidConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={voidLoading} onClick={handleVoidInvoice}>
              Void Invoice
            </Button>
          </div>
        </div>
      </Modal>
    </Drawer>
  );
}
