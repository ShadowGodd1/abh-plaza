import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  FileText,
  Building2,
  Wrench,
  BarChart3,
} from "lucide-react";
import MoneyDisplay from "@/components/ui/money-display";

const reports = [
  {
    id: "income",
    title: "Income Report",
    description: "Track all revenue including rent, service charges, and deposits.",
    icon: <TrendingUp size={20} className="text-success" />,
    href: "/reports?view=income",
  },
  {
    id: "expenses",
    title: "Expense Report",
    description: "Monitor all expenses including maintenance, payroll, and utilities.",
    icon: <TrendingDown size={20} className="text-danger" />,
    href: "/reports?view=expenses",
  },
  {
    id: "collection",
    title: "Collection Report",
    description: "View collection rates and outstanding balances.",
    icon: <CreditCard size={20} className="text-gold" />,
    href: "/reports?view=collection",
  },
  {
    id: "invoices",
    title: "Invoice Report",
    description: "All invoices by period, status, and amount.",
    icon: <FileText size={20} className="text-info" />,
    href: "/reports?view=invoices",
  },
  {
    id: "occupancy",
    title: "Occupancy Report",
    description: "Unit occupancy rates and vacancy tracking.",
    icon: <Building2 size={20} className="text-text-2" />,
    href: "/reports?view=occupancy",
  },
  {
    id: "maintenance",
    title: "Maintenance Report",
    description: "Maintenance request history and costs.",
    icon: <Wrench size={20} className="text-warning" />,
    href: "/reports?view=maintenance",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <span className="text-text-primary">Reports</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Reports</h1>
        <p className="text-sm text-text-3 mt-1">Financial and operational reports for the property.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={report.href}
            className="bg-surface rounded-[var(--radius-lg)] border border-border p-5 hover:shadow-[var(--shadow-card)] transition-shadow group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-surface-2 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/10 transition-colors">
                {report.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-1">{report.title}</h3>
                <p className="text-sm text-text-3">{report.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick summary */}
      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
          <BarChart3 size={18} />
          Quick Summary — September 2026
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-text-3 mb-1">Total Income</p>
            <MoneyDisplay amount={8600000} className="text-success" />
          </div>
          <div>
            <p className="text-xs text-text-3 mb-1">Total Expenses</p>
            <MoneyDisplay amount={4450000} className="text-danger" />
          </div>
          <div>
            <p className="text-xs text-text-3 mb-1">Collection Rate</p>
            <p className="text-base font-semibold text-text-primary font-tabular">87%</p>
          </div>
          <div>
            <p className="text-xs text-text-3 mb-1">Occupancy</p>
            <p className="text-base font-semibold text-text-primary font-tabular">82%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
