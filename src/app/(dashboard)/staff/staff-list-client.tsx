"use client";

import { useState } from "react";
import { Plus, Phone, AlertTriangle, CreditCard } from "lucide-react";
import Button from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import MoneyDisplay from "@/components/ui/money-display";
import Modal from "@/components/ui/modal";
import { formatDate, cn } from "@/lib/utils";
import { createStaffVendor } from "@/lib/actions";

type StaffMember = {
  id: string;
  name: string;
  initials: string;
  role: string;
  phone: string;
  paymentSchedule: string;
  amount: number | null;
  amountFormatted: string;
  schedule: string;
  lastPayment: string | null;
};

type PaymentHistoryEntry = {
  id: string;
  staffId: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
};

const DEMO_PAYROLL_HISTORY: PaymentHistoryEntry[] = [
  { id: "ph-1", staffId: "s-1", date: "2026-09-01", amount: 2500000, method: "M-Pesa", reference: "PAY-S1-202609" },
  { id: "ph-2", staffId: "s-1", date: "2026-08-01", amount: 2500000, method: "M-Pesa", reference: "PAY-S1-202608" },
  { id: "ph-3", staffId: "s-1", date: "2026-07-01", amount: 2500000, method: "M-Pesa", reference: "PAY-S1-202607" },
  { id: "ph-4", staffId: "s-2", date: "2026-09-01", amount: 1500000, method: "Bank Transfer", reference: "PAY-S2-202609" },
  { id: "ph-5", staffId: "s-2", date: "2026-08-01", amount: 1500000, method: "Bank Transfer", reference: "PAY-S2-202608" },
  { id: "ph-6", staffId: "s-2", date: "2026-07-01", amount: 1500000, method: "Bank Transfer", reference: "PAY-S2-202607" },
  { id: "ph-7", staffId: "s-3", date: "2026-08-15", amount: 800000, method: "M-Pesa", reference: "PAY-S3-202608" },
  { id: "ph-8", staffId: "s-4", date: "2026-07-20", amount: 600000, method: "Cash", reference: "PAY-S4-202607" },
];

interface StaffListClientProps {
  initialStaff: StaffMember[];
}

export default function StaffListClient({ initialStaff }: StaffListClientProps) {
  const [selected, setSelected] = useState<StaffMember | null>(null);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [showPayrollConfirm, setShowPayrollConfirm] = useState(false);
  const [detailTab, setDetailTab] = useState<"details" | "payments">("details");
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [addStaffLoading, setAddStaffLoading] = useState(false);
  const [addStaffError, setAddStaffError] = useState("");
  const [addStaffSuccess, setAddStaffSuccess] = useState(false);

  const handleRecordPayroll = async () => {
    setPayrollLoading(true);
    setShowPayrollConfirm(false);
    try {
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setPayrollLoading(false);
    }
  };

  const paymentHistory = selected
    ? DEMO_PAYROLL_HISTORY.filter((p) => p.staffId === selected.id)
    : [];

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => { setShowAddStaff(true); setAddStaffError(""); setAddStaffSuccess(false); }}>
          <Plus size={16} />
          Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialStaff.map((staff) => (
          <div
            key={staff.id}
            className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 hover:shadow-[var(--shadow-card)] transition-shadow cursor-pointer"
            onClick={() => { setSelected(staff); setDetailTab("details"); }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center flex-shrink-0">
                  <span className="text-text-2 text-sm font-medium">
                    {staff.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{staff.name}</p>
                  <p className="text-xs text-text-3">{staff.role}</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-border text-xs text-text-3">
              <div className="flex items-center gap-2">
                <Phone size={12} />
                {staff.phone}
              </div>
              <div className="flex justify-between">
                <span>Schedule: {staff.schedule}</span>
                {staff.amount && <span className="font-tabular text-text-2">{staff.amountFormatted}</span>}
              </div>
              <div className="flex justify-between">
                <span>Last paid: {staff.lastPayment || "N/A"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Staff Details"
        size="md"
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center">
                <span className="text-text-2 font-medium">
                  {selected.initials}
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold text-text-primary">{selected.name}</p>
                <p className="text-sm text-text-3">{selected.role}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-surface-2 rounded-[var(--radius-md)] p-1">
              {(["details", "payments"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors",
                    detailTab === tab
                      ? "bg-surface text-text-primary shadow-sm"
                      : "text-text-3 hover:text-text-2"
                  )}
                >
                  {tab === "details" ? "Details" : "Payment History"}
                </button>
              ))}
            </div>

            {detailTab === "details" ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-text-primary">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Payment Schedule</p>
                  <p className="text-sm text-text-primary">{selected.schedule}</p>
                </div>
                {selected.amount && (
                  <div>
                    <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Amount</p>
                    <MoneyDisplay amount={selected.amount} size="lg" />
                  </div>
                )}
                <div>
                  <p className="text-xs text-text-3 uppercase tracking-wider mb-1">Last Payment</p>
                  <p className="text-sm text-text-primary">{selected.lastPayment || "N/A"}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-[var(--radius-md)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                          <CreditCard size={14} className="text-success" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{formatDate(payment.date)}</p>
                          <p className="text-xs text-text-3">{payment.method} · {payment.reference}</p>
                        </div>
                      </div>
                      <MoneyDisplay amount={payment.amount} />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-3 text-center py-4">No payment history found.</p>
                )}
              </div>
            )}

            <div className="border-t border-border pt-4 sticky bottom-0 bg-surface pb-6">
              <Button
                className="w-full"
                loading={payrollLoading}
                onClick={() => setShowPayrollConfirm(true)}
              >
                Record Payroll Payment
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={showPayrollConfirm}
        onClose={() => setShowPayrollConfirm(false)}
        title="Record Payroll Payment"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-gold" />
            </div>
            <div>
              <p className="text-sm text-text-primary">
                You are about to record a payroll payment for{" "}
                <span className="font-medium">{selected?.name}</span>.
              </p>
              {selected?.amount && (
                <p className="text-sm text-text-3 mt-1">
                  Amount: <span className="font-medium text-text-primary">{selected.amountFormatted}</span>
                </p>
              )}
              <p className="text-sm text-text-3 mt-1">
                This will create a ledger entry and update the last payment date.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowPayrollConfirm(false)}>
              Cancel
            </Button>
            <Button loading={payrollLoading} onClick={handleRecordPayroll}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setShowAddStaff(false)} />
          <div className="relative z-10 w-full max-w-md bg-surface rounded-[var(--radius-lg)] border border-border shadow-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-1">Add Staff</h2>
            <p className="text-sm text-text-3 mb-5">Add a new staff member or vendor.</p>

            {addStaffError && (
              <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-danger-bg border border-danger/20">
                <p className="text-sm text-danger">{addStaffError}</p>
              </div>
            )}

            {addStaffSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-3">
                  <span className="text-success text-lg">✓</span>
                </div>
                <p className="text-sm text-text-primary font-medium">Staff added successfully</p>
                <Button className="mt-4" onClick={() => { setShowAddStaff(false); setAddStaffSuccess(false); window.location.reload(); }}>Done</Button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setAddStaffLoading(true);
                  setAddStaffError("");
                  const form = new FormData(e.currentTarget);
                  const result = await createStaffVendor(form);
                  setAddStaffLoading(false);
                  if (result?.error) {
                    setAddStaffError(result.error);
                  } else {
                    setAddStaffSuccess(true);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Full Name *</label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. James Otieno"
                    className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Role *</label>
                  <input
                    name="role"
                    required
                    placeholder="e.g. Cleaner, Security, Plumber"
                    className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Phone</label>
                  <input
                    name="phone"
                    placeholder="2547XXXXXXXX"
                    className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Payment Schedule</label>
                  <select
                    name="payment_schedule"
                    className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select schedule</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                    <option value="per_task">Per Task</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Amount (KES cents)</label>
                  <input
                    name="amount"
                    type="number"
                    placeholder="e.g. 250000 for KES 2,500"
                    className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowAddStaff(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" loading={addStaffLoading} className="flex-1">
                    Add Staff
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
