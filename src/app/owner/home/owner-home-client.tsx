"use client";

import Link from "next/link";
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
}

const owner = {
  name: "Ibrahim",
  unit: "A-01",
  type: "ownership",
  serviceCharge: 500000,
  outstanding: 0,
};

const recentPayments = [
  { month: "Sep", amount: 500000, paid: true },
  { month: "Aug", amount: 500000, paid: true },
  { month: "Jul", amount: 500000, paid: true },
];

export default function OwnerHomeClient({ metrics, greeting }: OwnerHomeClientProps) {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="ABH Plaza" className="h-8 w-auto rounded" />
          <h1 className="text-xl font-semibold text-text-primary">{greeting}, {owner.name}</h1>
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
                    <span className="text-success text-xs">✓</span>
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
