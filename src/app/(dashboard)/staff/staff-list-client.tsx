"use client";

import { useState } from "react";
import { Phone, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import MoneyDisplay from "@/components/ui/money-display";
import Modal from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";

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

interface StaffListClientProps {
  initialStaff: StaffMember[];
}

export default function StaffListClient({ initialStaff }: StaffListClientProps) {
  const [selected, setSelected] = useState<StaffMember | null>(null);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [showPayrollConfirm, setShowPayrollConfirm] = useState(false);

  const handleRecordPayroll = async () => {
    setPayrollLoading(true);
    setShowPayrollConfirm(false);
    try {
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setPayrollLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialStaff.map((staff) => (
          <div
            key={staff.id}
            className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 hover:shadow-[var(--shadow-card)] transition-shadow cursor-pointer"
            onClick={() => setSelected(staff)}
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

            <div className="border-t border-border pt-4">
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
    </>
  );
}
