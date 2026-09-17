"use client";

import Link from "next/link";
import { ChevronRight, Receipt, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface OwnerHomeClientProps {
  metrics: {
    recentPayments: Array<{
      id: string;
      unit: string;
      amount: number;
      date: string;
      status: string;
    }>;
  };
  greeting: string;
  ownerName: string;
  unitLabel: string;
}

const serviceChargeBreakdown = [
  { item: "Security Services", amount: 150000 },
  { item: "Cleaning & Maintenance", amount: 120000 },
  { item: "Utilities (Common Areas)", amount: 100000 },
  { item: "Insurance", amount: 80000 },
  { item: "Sinking Fund", amount: 50000 },
];

export default function OwnerHomeClient({ metrics, greeting, ownerName, unitLabel }: OwnerHomeClientProps) {
  const owner = {
    name: ownerName,
    unit: unitLabel,
    type: "ownership",
    serviceCharge: 500000,
    outstanding: 0,
  };

  const recentPayments = [
    { month: "Sep", amount: 500000, paid: true },
    { month: "Aug", amount: 500000, paid: true },
    { month: "Jul", amount: 500000, paid: true },
  ];
  const totalPaid = recentPayments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="ABH Plaza" className="h-8 w-auto rounded" />
          <div>
            <p className="text-[10px] text-text-3 uppercase tracking-wider">ABH Plaza</p>
            <h1 className="text-xl font-semibold text-text-primary">{greeting}, {owner.name}</h1>
          </div>
        </div>
      </div>

      <div className="bg-ink rounded-[var(--radius-xl)] p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-semibold text-white">{owner.unit}</p>
            <p className="text-xs text-gold/70 capitalize">{owner.type}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-white/50 mb-1">Service Charge</p>
          <p className="text-2xl font-bold text-white font-tabular">
            {formatCurrency(owner.serviceCharge)}
          </p>
          <p className="text-xs text-gold/70">per month</p>
        </div>

        {owner.outstanding === 0 ? (
          <div className="w-full py-3 text-center text-sm text-success bg-success/10 rounded-[var(--radius-md)]">
            All payments up to date
          </div>
        ) : (
          <Link href="/owner/payments">
            <Button className="w-full bg-gold text-ink hover:bg-gold-light" size="lg">
              PAY NOW
            </Button>
          </Link>
        )}
      </div>

      {/* Service Charge Invoice Detail */}
      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-text-primary flex items-center gap-2">
            <Receipt size={14} className="text-gold" />
            Current Month Service Charge
          </h3>
          <span className="text-[10px] text-text-3 uppercase">{new Date().toLocaleDateString("en-KE", { month: "short", year: "numeric" })}</span>
        </div>

        <div className="space-y-2 mb-3">
          {serviceChargeBreakdown.map((item) => (
            <div key={item.item} className="flex justify-between text-xs">
              <span className="text-text-2">{item.item}</span>
              <span className="font-tabular text-text-primary">{formatCurrency(item.amount)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between text-sm font-medium">
            <span className="text-text-primary">Total</span>
            <span className="font-tabular text-text-primary">{formatCurrency(owner.serviceCharge)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-success-bg/50 rounded-[var(--radius-sm)] p-2.5 text-center">
            <p className="text-[10px] text-success uppercase">Paid</p>
            <p className="text-sm font-semibold text-success font-tabular mt-0.5">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-surface-2/50 rounded-[var(--radius-sm)] p-2.5 text-center">
            <p className="text-[10px] text-text-3 uppercase">Outstanding</p>
            <p className="text-sm font-semibold text-text-primary font-tabular mt-0.5">{formatCurrency(owner.outstanding)}</p>
          </div>
        </div>

        <Link
          href="/owner/invoices"
          className="flex items-center justify-center gap-1 text-sm text-gold hover:text-gold-dark transition-colors"
        >
          View all invoices <ChevronRight size={14} />
        </Link>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 mb-4">
        <h3 className="text-sm font-medium text-text-primary mb-3">Recent payments</h3>
        <div className="divide-y divide-border">
          {recentPayments.map((p) => (
            <div key={p.month} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-text-2">{p.month}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary font-tabular">
                  {formatCurrency(p.amount)}
                </span>
                {p.paid && (
                  <span className="w-5 h-5 rounded-full bg-success-bg flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-success" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
