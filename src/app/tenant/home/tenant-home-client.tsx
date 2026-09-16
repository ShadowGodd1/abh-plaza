"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface RecentPayment {
  month: string;
  amount: number;
  paid: boolean;
}

interface TenantHomeClientProps {
  recentPayments: RecentPayment[];
  openMaintenance: number;
}

export default function TenantHomeClient({ recentPayments, openMaintenance }: TenantHomeClientProps) {
  return (
    <>
      {/* Recent payments */}
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

      {/* Maintenance */}
      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 mb-4">
        <h3 className="text-sm font-medium text-text-primary mb-2">Maintenance</h3>
        {openMaintenance === 0 ? (
          <p className="text-sm text-text-3">No open requests</p>
        ) : (
          <p className="text-sm text-text-2">{openMaintenance} open request(s)</p>
        )}
        <Link
          href="/tenant/maintenance"
          className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold-dark mt-2 transition-colors"
        >
          Report an issue <ChevronRight size={14} />
        </Link>
      </div>
    </>
  );
}
