"use client";

import { useState } from "react";
import { Link2, XCircle, RotateCcw, Search } from "lucide-react";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import StatusBadge from "@/components/ui/status-badge";
import { formatCurrency, formatDate, formatPhoneDisplay } from "@/lib/utils";
import { DEMO_INVOICES } from "@/lib/demo-data";

interface Exception {
  id: string;
  transactionId: string;
  phone: string;
  amount: number;
  dateReceived: string;
  reason: "no_match" | "multiple_matches" | "amount_mismatch";
  status: "pending" | "ignored";
}

const reasonLabels: Record<string, string> = {
  no_match: "No matching invoice",
  multiple_matches: "Multiple matches",
  amount_mismatch: "Amount mismatch",
};

const reasonColors: Record<string, string> = {
  no_match: "bg-danger-bg text-danger",
  multiple_matches: "bg-warning-bg text-warning",
  amount_mismatch: "bg-info-bg text-info",
};

export default function ExceptionsClient({ initialExceptions }: { initialExceptions: Exception[] }) {
  const [exceptions, setExceptions] = useState(initialExceptions);
  const [search, setSearch] = useState("");
  const [matchModal, setMatchModal] = useState<Exception | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState("");

  const filtered = exceptions.filter((ex) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      ex.transactionId.toLowerCase().includes(q) ||
      ex.phone.includes(q) ||
      formatCurrency(ex.amount).toLowerCase().includes(q)
    );
  });

  const pendingCount = exceptions.filter((ex) => ex.status === "pending").length;

  const handleIgnore = (id: string) => {
    setExceptions((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, status: "ignored" as const } : ex))
    );
  };

  const handleMatch = () => {
    if (!matchModal || !selectedInvoice) return;
    setExceptions((prev) => prev.filter((ex) => ex.id !== matchModal.id));
    setMatchModal(null);
    setSelectedInvoice("");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search by transaction ID, phone, or amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-3">Pending:</span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-danger text-white text-xs font-medium">
              {pendingCount}
            </span>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Transaction ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Phone</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Date Received</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Reason</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((ex) => (
                <tr key={ex.id} className="hover:bg-surface-2/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-text-primary font-tabular">{ex.transactionId}</td>
                  <td className="px-4 py-3 text-sm text-text-2 font-tabular">{formatPhoneDisplay(ex.phone)}</td>
                  <td className="px-4 py-3 text-sm text-text-primary text-right font-tabular">{formatCurrency(ex.amount)}</td>
                  <td className="px-4 py-3 text-sm text-text-2">{formatDate(ex.dateReceived)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${reasonColors[ex.reason]}`}>
                      {reasonLabels[ex.reason]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ex.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {ex.status === "pending" && (
                        <>
                          <button
                            onClick={() => setMatchModal(ex)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gold hover:text-gold-dark hover:bg-gold/5 rounded-[var(--radius-sm)] transition-colors"
                          >
                            <Link2 size={12} />
                            Match to Invoice
                          </button>
                          <button
                            onClick={() => handleIgnore(ex.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-3 hover:text-text-primary hover:bg-surface-2 rounded-[var(--radius-sm)] transition-colors"
                          >
                            <XCircle size={12} />
                            Ignore
                          </button>
                          <button
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-3 hover:text-danger hover:bg-danger/5 rounded-[var(--radius-sm)] transition-colors"
                          >
                            <RotateCcw size={12} />
                            Refund
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y divide-border">
          {filtered.map((ex) => (
            <div key={ex.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary font-tabular">{ex.transactionId}</span>
                <StatusBadge status={ex.status} size="sm" />
              </div>
              <p className="text-sm text-text-2">{formatPhoneDisplay(ex.phone)} · {formatCurrency(ex.amount)}</p>
              <p className="text-xs text-text-3">{formatDate(ex.dateReceived)}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${reasonColors[ex.reason]}`}>
                {reasonLabels[ex.reason]}
              </span>
              {ex.status === "pending" && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setMatchModal(ex)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gold hover:text-gold-dark hover:bg-gold/5 rounded-[var(--radius-sm)] transition-colors"
                  >
                    <Link2 size={12} />
                    Match
                  </button>
                  <button
                    onClick={() => handleIgnore(ex.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-text-3 hover:text-text-primary hover:bg-surface-2 rounded-[var(--radius-sm)] transition-colors"
                  >
                    <XCircle size={12} />
                    Ignore
                  </button>
                  <button className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-text-3 hover:text-danger hover:bg-danger/5 rounded-[var(--radius-sm)] transition-colors">
                    <RotateCcw size={12} />
                    Refund
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-text-3">No exceptions found.</p>
          </div>
        )}
      </div>

      <Modal
        open={!!matchModal}
        onClose={() => { setMatchModal(null); setSelectedInvoice(""); }}
        title="Match to Invoice"
        description="Select an invoice to match this payment to."
        size="md"
      >
        {matchModal && (
          <div className="space-y-4">
            <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Transaction</span>
                <span className="text-text-primary font-medium font-tabular">{matchModal.transactionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Phone</span>
                <span className="text-text-primary font-medium">{formatPhoneDisplay(matchModal.phone)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Amount</span>
                <span className="text-text-primary font-medium">{formatCurrency(matchModal.amount)}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-3 uppercase tracking-wider block mb-1.5">Select Invoice</label>
              <select
                value={selectedInvoice}
                onChange={(e) => setSelectedInvoice(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="">Choose an invoice...</option>
                {DEMO_INVOICES.filter((inv) => inv.status !== "paid" && inv.status !== "void").map((inv) => (
                  <option key={inv.id} value={inv.number}>
                    {inv.number} — {inv.tenant} ({inv.unit}) — {formatCurrency(inv.amount)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={() => { setMatchModal(null); setSelectedInvoice(""); }}>
                Cancel
              </Button>
              <Button disabled={!selectedInvoice} onClick={handleMatch}>
                Match Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
