import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";
import { getDashboardMetrics } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import TenantHomeClient from "./tenant-home-client";

function formatDueDate(date: string): string {
  return new Date(date).toLocaleDateString("en-KE", { day: "numeric", month: "short" });
}

export default async function TenantHomePage() {
  const metrics = await getDashboardMetrics();

  const tenant = {
    name: "Ahmed",
    unit: "A-04",
    status: "occupied",
    outstanding: metrics.overdue.amount || (metrics.outstandingInvoices[0] ? (metrics.outstandingInvoices[0] as any).amount : 0),
    dueDate: metrics.outstandingInvoices[0] ? (metrics.outstandingInvoices[0] as any).dueDate : "",
    recentPayments: metrics.recentPayments.slice(0, 3).map((p: any) => ({
      month: new Date(p.date).toLocaleDateString("en-KE", { month: "short" }),
      amount: p.amount,
      paid: p.status === "completed",
    })),
    openMaintenance: metrics.maintenanceOpen.length,
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="ABH Plaza" className="h-8 w-auto rounded" />
          <div>
            <p className="text-[10px] text-text-3 uppercase tracking-wider">ABH Plaza</p>
            <h1 className="text-lg sm:text-xl font-semibold text-text-primary">{greeting}, {tenant.name}</h1>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center" aria-label="Notifications">
          <span className="w-2 h-2 rounded-full bg-gold" />
        </button>
      </div>

      {/* Unit badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1.5 bg-gold/10 text-gold text-sm font-semibold rounded-full">
          {tenant.unit}
        </span>
        <span className="px-2.5 py-1 bg-success-bg text-success text-xs font-medium rounded-full capitalize">
          {tenant.status}
        </span>
      </div>

      {/* Balance card */}
      <div className="bg-ink rounded-[var(--radius-xl)] p-5 mb-4">
        <div className="mb-4">
          <p className="text-xs text-white/50 mb-1">Outstanding Balance</p>
          <p className="text-3xl font-bold text-white font-tabular">
            {formatCurrency(tenant.outstanding)}
          </p>
          <p className="text-xs text-gold/70 mt-1">Due {formatDueDate(tenant.dueDate)}</p>
        </div>

        <Link href="/tenant/payments">
          <Button className="w-full bg-gold text-ink hover:bg-gold-light" size="lg">
            PAY NOW
          </Button>
        </Link>
      </div>

      {/* Quick actions - 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link href="/tenant/payments" className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 flex flex-col items-center gap-2 hover:shadow-[var(--shadow-card)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <span className="text-gold text-lg">KES</span>
          </div>
          <span className="text-xs font-medium text-text-primary text-center">Make Payment</span>
        </Link>
        <Link href="/tenant/maintenance" className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 flex flex-col items-center gap-2 hover:shadow-[var(--shadow-card)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-info-bg flex items-center justify-center">
            <span className="text-info text-lg">!</span>
          </div>
          <span className="text-xs font-medium text-text-primary text-center">Report Issue</span>
        </Link>
        <Link href="/tenant/messages" className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 flex flex-col items-center gap-2 hover:shadow-[var(--shadow-card)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center">
            <span className="text-text-3 text-lg">M</span>
          </div>
          <span className="text-xs font-medium text-text-primary text-center">Messages</span>
        </Link>
        <Link href="/tenant/account" className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 flex flex-col items-center gap-2 hover:shadow-[var(--shadow-card)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center">
            <span className="text-text-3 text-lg">A</span>
          </div>
          <span className="text-xs font-medium text-text-primary text-center">Account</span>
        </Link>
      </div>

      <TenantHomeClient
        recentPayments={tenant.recentPayments}
        openMaintenance={tenant.openMaintenance}
      />
    </div>
  );
}
