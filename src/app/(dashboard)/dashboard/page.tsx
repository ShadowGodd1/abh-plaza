import Link from "next/link";
import {
  Building2,
  Home,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import MetricCard from "@/components/ui/metric-card";
import StatusBadge from "@/components/ui/status-badge";
import { getDashboardMetrics } from "@/lib/data";
import QuickActions from "./quick-actions";
import DashboardCharts from "./dashboard-charts";

function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100);
}

function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getPaymentTenant(p: any): string {
  return p.invoice?.occupancy?.person?.full_name || p.tenant || "Unknown";
}

function getPaymentUnit(p: any): string {
  return p.invoice?.occupancy?.unit?.label || p.unit || "";
}

function getPaymentDate(p: any): string {
  return p.paid_at || p.date || "";
}

function getInvoiceTenant(inv: any): string {
  return inv.occupancy?.person?.full_name || inv.tenant || "Unknown";
}

function getInvoiceUnit(inv: any): string {
  return inv.occupancy?.unit?.label || inv.unit || "";
}

function getMaintenanceIssue(r: any): string {
  return r.issue || r.description || "Unknown issue";
}

function getMaintenanceUnit(r: any): string {
  return typeof r.unit === "string" ? r.unit : r.unit?.label || "N/A";
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-3 mt-1">
          What is happening at ABH Plaza and what needs your attention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Occupied Units"
          value={`${metrics.occupiedUnits.percentage}%`}
          subtitle={`${metrics.occupiedUnits.count} / ${metrics.occupiedUnits.total} units`}
          icon={<Home size={20} />}
        />
        <MetricCard
          label="Vacant Units"
          value={metrics.vacantUnits.count.toString()}
          subtitle={`${metrics.vacantUnits.percentage}% availability`}
          icon={<Building2 size={20} />}
        />
        <MetricCard
          label="Collection"
          value={formatCurrency(metrics.collection.amount)}
          subtitle={`${metrics.collection.rate}% collection rate`}
          icon={<TrendingUp size={20} />}
        />
        <MetricCard
          label="Overdue"
          value={formatCurrency(metrics.overdue.amount)}
          subtitle={`${metrics.overdue.invoices} invoices`}
          icon={<AlertTriangle size={20} />}
        />
      </div>

      <QuickActions />

      <DashboardCharts collectionRate={metrics.collection.rate} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-primary">Recent Payments</h3>
            <Link
              href="/billing/payments"
              className="text-xs text-gold hover:text-gold-dark flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {metrics.recentPayments.map((payment: any) => (
              <div key={payment.id} className="px-4 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{getPaymentTenant(payment)}</p>
                  <p className="text-xs text-text-3">{getPaymentUnit(payment)} · {formatDate(getPaymentDate(payment))}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-sm font-medium text-text-primary font-tabular">
                    {formatCurrency(payment.amount)}
                  </p>
                  <StatusBadge status={payment.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-[var(--radius-lg)] border border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-primary">Outstanding Invoices</h3>
            <Link
              href="/billing/invoices"
              className="text-xs text-gold hover:text-gold-dark flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {metrics.outstandingInvoices.map((invoice: any) => (
              <div
                key={invoice.id}
                className={`px-4 py-3 flex items-center justify-between ${
                  invoice.status === "overdue"
                    ? "bg-danger/[0.03]"
                    : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{getInvoiceUnit(invoice)} · {getInvoiceTenant(invoice)}</p>
                  <p className={`text-xs ${invoice.status === "overdue" ? "text-danger font-medium" : "text-text-3"}`}>
                    Due {formatDate(invoice.due_date || invoice.dueDate)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-sm font-medium text-text-primary font-tabular">
                    {formatCurrency(invoice.amount_due || invoice.amount)}
                  </p>
                  <StatusBadge status={invoice.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-[var(--radius-lg)] border border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-primary">Maintenance</h3>
            <Link
              href="/maintenance"
              className="text-xs text-gold hover:text-gold-dark flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {metrics.maintenanceOpen.map((req: any) => (
              <div key={req.id} className="px-4 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{getMaintenanceIssue(req)}</p>
                  <p className="text-xs text-text-3">{getMaintenanceUnit(req)}</p>
                </div>
                <StatusBadge status={req.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
