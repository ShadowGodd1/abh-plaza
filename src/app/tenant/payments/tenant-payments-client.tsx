"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import StatusBadge from "@/components/ui/status-badge";
import { normalizeKenyanPhone, formatCurrency } from "@/lib/utils";

type PaymentStep = "select" | "confirm" | "processing" | "check_phone" | "success" | "failed";

interface Invoice {
  id: string;
  number: string;
  amount: number;
  dueDateFormatted: string;
  status: string;
}

interface Payment {
  month: string;
  amountFormatted: string;
  receipt: string | null;
  status: string;
}

interface TenantPaymentsClientProps {
  invoices: Invoice[];
  recentPayments: Payment[];
  unitLabel?: string;
}

export default function TenantPaymentsClient({ invoices, recentPayments, unitLabel }: TenantPaymentsClientProps) {
  const [step, setStep] = useState<PaymentStep>("select");
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handlePayNow = (invoiceIndex: number) => {
    setSelectedInvoice(invoiceIndex);
    setStep("confirm");
  };

  const handleConfirmPayment = () => {
    const normalized = normalizeKenyanPhone(phone);
    if (normalized.length !== 12 || (!normalized.startsWith("2547") && !normalized.startsWith("2541"))) {
      setPhoneError("Enter a valid Kenyan phone number.");
      return;
    }
    setPhoneError("");
    setStep("processing");

    setTimeout(() => setStep("check_phone"), 2000);
    setTimeout(() => setStep("success"), 8000);
  };

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Payment received</h2>
          <p className="text-sm text-text-3 mb-1">Receipt: QHK4X7B2RT</p>
          <p className="text-sm text-text-3 mb-6">
            {selectedInvoice !== null && formatCurrency(invoices[selectedInvoice].amount)} has been applied to your invoice.
          </p>
          <Button onClick={() => { setStep("select"); setSelectedInvoice(null); }} variant="secondary">
            Back to Payments
          </Button>
        </div>
      </div>
    );
  }

  if (step === "failed") {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-full bg-danger-bg flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-danger" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Payment could not be completed</h2>
          <p className="text-sm text-text-3 mb-6">Please check your phone and try again.</p>
          <Button onClick={() => setStep("select")} variant="secondary">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (step === "processing" || step === "check_phone") {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Loader2 size={32} className="text-gold animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            {step === "processing" ? "Sending payment request…" : "Check your phone for the M-Pesa prompt."}
          </h2>
          <p className="text-sm text-text-3">Complete the payment on your phone.</p>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    const invoice = selectedInvoice !== null ? invoices[selectedInvoice] : null;
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold text-text-primary mb-6">Confirm Payment</h1>

        {invoice && (
          <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-5 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Invoice</span>
                <span className="text-text-primary font-medium font-tabular">{invoice.number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Amount</span>
                <span className="text-text-primary font-semibold font-tabular text-lg">{formatCurrency(invoice.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-3">Due Date</span>
                <span className="text-text-primary">{invoice.dueDateFormatted}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="M-Pesa Phone Number"
            type="tel"
            id="phone"
            placeholder="07XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={phoneError}
          />

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setStep("select")}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleConfirmPayment}>
              Pay Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-text-primary mb-1">Payments</h1>
      <p className="text-sm text-text-3 mb-6">Manage your invoices and payments.</p>

      {/* Outstanding invoices */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-text-primary mb-3">Outstanding</h2>
        {invoices.map((inv, i) => (
          <div key={inv.id} className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text-primary font-tabular">{inv.number}</span>
              <StatusBadge status={inv.status} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-text-primary font-tabular">{formatCurrency(inv.amount)}</p>
                <p className="text-xs text-text-3">Due {inv.dueDateFormatted}</p>
              </div>
              <Button size="sm" onClick={() => handlePayNow(i)}>
                Pay Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent payments */}
      <div>
        <h2 className="text-sm font-medium text-text-primary mb-3">Recent payments</h2>
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border divide-y divide-border">
          {recentPayments.map((p) => (
            <div key={p.month} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-text-2">{p.month}</p>
                <p className="text-xs text-text-3 font-tabular">Receipt: {p.receipt}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary font-tabular">{p.amountFormatted}</p>
                <StatusBadge status={p.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
