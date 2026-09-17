"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  CreditCard,
  FileText,
  Building2,
  Wrench,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Circle,
  Printer,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import MoneyDisplay from "@/components/ui/money-display";
import {
  DEMO_LEDGER,
  DEMO_INVOICES,
  DEMO_UNITS,
  DEMO_MAINTENANCE,
  totalOccupied,
  totalVacant,
  totalUnits,
  occupancyRate,
  totalCollection,
  totalExpected,
  collectionRate,
} from "@/lib/demo-data";

type View = "income" | "expenses" | "collection" | "invoices" | "occupancy" | "maintenance";

const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"];
const STATUS_COLORS = { paid: "#22c55e", pending: "#f59e0b", overdue: "#ef4444", partial: "#3b82f6" };

function SectionHeader({ icon, title, onBack, printType }: { icon: React.ReactNode; title: string; onBack: () => void; printType?: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-text-3 hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Reports
      </button>
      <div className="h-5 w-px bg-border" />
      <div className="flex items-center gap-2 flex-1">
        {icon}
        <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
      </div>
      {printType && (
        <button
          onClick={() => window.open(`/reports/print?type=${printType}`, "_blank")}
          className="no-print flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-2 border border-border rounded-[var(--radius-md)] hover:bg-surface-2 transition-colors"
        >
          <Printer size={14} />
          Print
        </button>
      )}
    </div>
  );
}

function StatCard({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4">
      <p className="text-xs text-text-3 mb-1">{label}</p>
      <div className={className}>{value}</div>
    </div>
  );
}

/* ─── Income Report ─── */
function IncomeReport({ onBack }: { onBack: () => void }) {
  const incomeEntries = DEMO_LEDGER.filter((e) => e.type === "income");
  const totalIncome = incomeEntries.reduce((s, e) => s + e.amount, 0);
  const monthlyAvg = totalIncome;
  const highestMonth = totalIncome;

  const byCategory = [
    { name: "Rent", value: incomeEntries.filter((e) => e.category === "rent").reduce((s, e) => s + e.amount, 0) },
    { name: "Service Charge", value: incomeEntries.filter((e) => e.category === "service_charge").reduce((s, e) => s + e.amount, 0) },
    { name: "Other", value: incomeEntries.filter((e) => !["rent", "service_charge"].includes(e.category)).reduce((s, e) => s + e.amount, 0) },
  ];

  const monthlyData = [
    { month: "Sep 2026", Rent: byCategory[0].value, "Service Charge": byCategory[1].value, Other: byCategory[2].value },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={<TrendingUp size={20} className="text-success" />} title="Income Report" onBack={onBack} printType="income" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Income" value={<MoneyDisplay amount={totalIncome} className="text-success" size="lg" />} />
        <StatCard label="Monthly Average" value={<MoneyDisplay amount={monthlyAvg} className="text-text-primary" size="lg" />} />
        <StatCard label="Highest Month" value={<MoneyDisplay amount={highestMonth} className="text-text-primary" size="lg" />} />
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Monthly Income by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: "var(--text-3)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--text-3)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }} />
            <Legend />
            <Bar dataKey="Rent" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Service Charge" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Other" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">Income Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Description</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomeEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3 text-text-primary font-tabular">{entry.date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success capitalize">
                      {entry.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-2">{entry.description}</td>
                  <td className="px-4 py-3 text-right"><MoneyDisplay amount={entry.amount} className="text-success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Expense Report ─── */
function ExpenseReport({ onBack }: { onBack: () => void }) {
  const expenseEntries = DEMO_LEDGER.filter((e) => e.type === "expense");
  const totalExpenses = expenseEntries.reduce((s, e) => s + e.amount, 0);
  const monthlyAvg = totalExpenses;

  const monthlyData = [
    {
      month: "Sep 2026",
      Maintenance: expenseEntries.filter((e) => e.category === "maintenance").reduce((s, e) => s + e.amount, 0),
      Payroll: expenseEntries.filter((e) => e.category === "payroll").reduce((s, e) => s + e.amount, 0),
      Utility: expenseEntries.filter((e) => e.category === "utility").reduce((s, e) => s + e.amount, 0),
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={<TrendingDown size={20} className="text-danger" />} title="Expense Report" onBack={onBack} printType="expenses" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Total Expenses" value={<MoneyDisplay amount={totalExpenses} className="text-danger" size="lg" />} />
        <StatCard label="Monthly Average" value={<MoneyDisplay amount={monthlyAvg} className="text-text-primary" size="lg" />} />
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Monthly Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: "var(--text-3)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--text-3)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }} />
            <Legend />
            <Bar dataKey="Maintenance" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Payroll" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Utility" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">Expense Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Description</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3 text-text-primary font-tabular">{entry.date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger capitalize">
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-2">{entry.description}</td>
                  <td className="px-4 py-3 text-right"><MoneyDisplay amount={entry.amount} className="text-danger" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Collection Report ─── */
function CollectionReport({ onBack }: { onBack: () => void }) {
  const [chartAnimated, setChartAnimated] = useState(false);

  const paid = DEMO_INVOICES.filter((i) => i.status === "paid");
  const pending = DEMO_INVOICES.filter((i) => i.status === "pending");
  const overdue = DEMO_INVOICES.filter((i) => i.status === "overdue");
  const partial = DEMO_INVOICES.filter((i) => i.status === "partial");

  const totalPaidAmount = paid.reduce((s, i) => s + i.amount, 0);
  const totalOutstandingAmount = [...pending, ...overdue, ...partial].reduce(
    (s, i) => s + (i.amount - i.amountPaid),
    0
  );
  const totalOverdueAmount = overdue.reduce((s, i) => s + (i.amount - i.amountPaid), 0);

  const pieData = [
    { name: "Paid", value: totalPaidAmount },
    { name: "Outstanding", value: totalOutstandingAmount },
    { name: "Overdue", value: totalOverdueAmount },
  ];

  if (!chartAnimated) {
    setTimeout(() => setChartAnimated(true), 100);
  }

  return (
    <div className="space-y-6">
      <SectionHeader icon={<CreditCard size={20} className="text-gold" />} title="Collection Report" onBack={onBack} printType="collection" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Collection Rate" value={<p className="text-2xl font-bold text-success font-tabular">{collectionRate}%</p>} />
        <StatCard label="Total Expected" value={<MoneyDisplay amount={totalExpected} className="text-text-primary" size="lg" />} />
        <StatCard label="Total Collected" value={<MoneyDisplay amount={totalCollection} className="text-success" size="lg" />} />
        <StatCard label="Total Outstanding" value={<MoneyDisplay amount={totalOutstandingAmount} className="text-danger" size="lg" />} />
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Payment Status Distribution</h3>
        <div
          className="relative"
          style={{ opacity: chartAnimated ? 1 : 0, transform: chartAnimated ? "scale(1)" : "scale(0.9)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: unknown) => `KES ${((value as number) / 100).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary font-tabular">{collectionRate}%</p>
              <p className="text-xs text-text-3">Collected</p>
            </div>
          </div>
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-semibold text-danger flex items-center gap-2">
              <AlertTriangle size={16} /> Overdue Invoices ({overdue.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Invoice</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Unit</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Tenant</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-3">Amount Due</th>
                </tr>
              </thead>
              <tbody>
                {overdue.map((inv) => (
                  <tr key={inv.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-primary font-tabular">{inv.number}</td>
                    <td className="px-4 py-3 text-text-2">{inv.unit}</td>
                    <td className="px-4 py-3 text-text-2">{inv.tenant}</td>
                    <td className="px-4 py-3 text-right">
                      <MoneyDisplay amount={inv.amount - inv.amountPaid} className="text-danger" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Invoice Report ─── */
function InvoiceReport({ onBack }: { onBack: () => void }) {
  const statuses = ["paid", "pending", "overdue", "partial"] as const;
  const grouped = statuses.map((s) => ({
    status: s,
    invoices: DEMO_INVOICES.filter((i) => i.status === s),
  }));

  const statusMeta: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    paid: { color: "text-success", bg: "bg-success/10", icon: <CheckCircle size={14} /> },
    pending: { color: "text-gold", bg: "bg-gold/10", icon: <Clock size={14} /> },
    overdue: { color: "text-danger", bg: "bg-danger/10", icon: <AlertTriangle size={14} /> },
    partial: { color: "text-info", bg: "bg-info/10", icon: <Circle size={14} /> },
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={<FileText size={20} className="text-info" />} title="Invoice Report" onBack={onBack} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {grouped.map(({ status, invoices }) => {
          const meta = statusMeta[status];
          const total = invoices.reduce((s, i) => s + i.amount, 0);
          return (
            <div key={status} className="bg-surface rounded-[var(--radius-lg)] border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`${meta.bg} ${meta.color} p-1 rounded-full`}>{meta.icon}</span>
                <span className="text-xs text-text-3 capitalize">{status}</span>
              </div>
              <p className={`text-2xl font-bold font-tabular ${meta.color}`}>{invoices.length}</p>
              <MoneyDisplay amount={total} className="text-text-3 text-xs" size="sm" />
            </div>
          );
        })}
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Tenant</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Period</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3">Amount</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3">Paid</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map(({ status, invoices }) =>
                invoices.map((inv) => {
                  const meta = statusMeta[status];
                  return (
                    <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                      <td className="px-4 py-3 text-text-primary font-tabular">{inv.number}</td>
                      <td className="px-4 py-3 text-text-2">{inv.unit}</td>
                      <td className="px-4 py-3 text-text-2">{inv.tenant}</td>
                      <td className="px-4 py-3 text-text-3">{inv.period}</td>
                      <td className="px-4 py-3 text-right"><MoneyDisplay amount={inv.amount} /></td>
                      <td className="px-4 py-3 text-right"><MoneyDisplay amount={inv.amountPaid} /></td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.bg} ${meta.color} capitalize`}>
                          {meta.icon} {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Occupancy Report ─── */
function OccupancyReport({ onBack }: { onBack: () => void }) {
  const floors = Array.from(new Set(DEMO_UNITS.map((u) => u.floor))).sort((a, b) => a - b);
  const floorData = floors.map((floor) => {
    const floorUnits = DEMO_UNITS.filter((u) => u.floor === floor);
    return {
      floor: floor === 0 ? "Ground" : `Floor ${floor}`,
      Occupied: floorUnits.filter((u) => u.status === "occupied").length,
      Vacant: floorUnits.filter((u) => u.status === "vacant").length,
      "Under Maintenance": floorUnits.filter((u) => u.status === "under_maintenance").length,
      Reserved: floorUnits.filter((u) => u.status === "reserved").length,
    };
  });

  const vacantUnits = DEMO_UNITS.filter((u) => u.status === "vacant" || u.status === "under_maintenance");

  return (
    <div className="space-y-6">
      <SectionHeader icon={<Building2 size={20} className="text-text-2" />} title="Occupancy Report" onBack={onBack} printType="occupancy" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-text-3 mb-1">Occupancy Rate</p>
          <div className="relative w-20 h-20 mx-auto my-2">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray={`${occupancyRate}, 100`} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-text-primary font-tabular">{occupancyRate}%</span>
          </div>
        </div>
        <StatCard label="Total Units" value={<p className="text-2xl font-bold text-text-primary font-tabular">{totalUnits}</p>} />
        <StatCard label="Occupied" value={<p className="text-2xl font-bold text-success font-tabular">{totalOccupied}</p>} />
        <StatCard label="Vacant" value={<p className="text-2xl font-bold text-danger font-tabular">{totalVacant}</p>} />
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Floor-by-Floor Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={floorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="floor" tick={{ fill: "var(--text-3)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--text-3)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }} />
            <Legend />
            <Bar dataKey="Occupied" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Vacant" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Under Maintenance" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Reserved" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {vacantUnits.length > 0 && (
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-semibold text-text-primary">Vacant / Available Units</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Unit</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Floor</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-3">Rent</th>
                </tr>
              </thead>
              <tbody>
                {vacantUnits.map((unit) => (
                  <tr key={unit.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-primary font-medium">{unit.label}</td>
                    <td className="px-4 py-3 text-text-2">{unit.floor === 0 ? "Ground" : unit.floor}</td>
                    <td className="px-4 py-3 text-text-2">{unit.type}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        unit.status === "vacant" ? "bg-danger/10 text-danger" : "bg-gold/10 text-gold"
                      } capitalize`}>
                        {unit.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right"><MoneyDisplay amount={unit.rent} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Maintenance Report ─── */
function MaintenanceReport({ onBack }: { onBack: () => void }) {
  const open = DEMO_MAINTENANCE.filter((m) => m.status === "open");
  const inProgress = DEMO_MAINTENANCE.filter((m) => m.status === "in_progress");
  const resolved = DEMO_MAINTENANCE.filter((m) => m.status === "resolved");
  const totalCost = DEMO_MAINTENANCE.reduce((s, m) => s + (m.cost ?? 0), 0);

  const pieData = [
    { name: "Open", value: open.length },
    { name: "In Progress", value: inProgress.length },
    { name: "Resolved", value: resolved.length },
  ];

  const statusMeta: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    open: { color: "text-danger", bg: "bg-danger/10", icon: <Circle size={14} /> },
    in_progress: { color: "text-gold", bg: "bg-gold/10", icon: <Clock size={14} /> },
    resolved: { color: "text-success", bg: "bg-success/10", icon: <CheckCircle size={14} /> },
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={<Wrench size={20} className="text-warning" />} title="Maintenance Report" onBack={onBack} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={<p className="text-2xl font-bold text-text-primary font-tabular">{DEMO_MAINTENANCE.length}</p>} />
        <StatCard label="Open" value={<p className="text-2xl font-bold text-danger font-tabular">{open.length}</p>} />
        <StatCard label="In Progress" value={<p className="text-2xl font-bold text-gold font-tabular">{inProgress.length}</p>} />
        <StatCard label="Resolved" value={<p className="text-2xl font-bold text-success font-tabular">{resolved.length}</p>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6 flex flex-col justify-center">
          <h3 className="text-base font-semibold text-text-primary mb-4">Cost Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-3">Total Maintenance Costs</span>
              <MoneyDisplay amount={totalCost} className="text-danger" size="lg" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-3">Avg Cost per Resolved</span>
              <MoneyDisplay amount={resolved.length > 0 ? Math.round(totalCost / resolved.length) : 0} className="text-text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">All Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Issue</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-3">Raised By</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-text-3">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-3">Cost</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_MAINTENANCE.map((m) => {
                const meta = statusMeta[m.status];
                return (
                  <tr key={m.id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3 text-text-primary font-tabular">{m.date}</td>
                    <td className="px-4 py-3 text-text-2">{m.issue}</td>
                    <td className="px-4 py-3 text-text-2">{m.unit}</td>
                    <td className="px-4 py-3 text-text-2">{m.raisedBy}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.bg} ${meta.color} capitalize`}>
                        {meta.icon} {m.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {m.cost !== null ? <MoneyDisplay amount={m.cost} /> : <span className="text-text-3">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Client Component ─── */
export default function ReportsClient({ view }: { view: string | null }) {
  const router = useRouter();
  const onBack = () => router.push("/reports");

  if (view === "income") return <IncomeReport onBack={onBack} />;
  if (view === "expenses") return <ExpenseReport onBack={onBack} />;
  if (view === "collection") return <CollectionReport onBack={onBack} />;
  if (view === "invoices") return <InvoiceReport onBack={onBack} />;
  if (view === "occupancy") return <OccupancyReport onBack={onBack} />;
  if (view === "maintenance") return <MaintenanceReport onBack={onBack} />;

  return null;
}
