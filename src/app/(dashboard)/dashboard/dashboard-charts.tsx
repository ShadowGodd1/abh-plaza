"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100);
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ink text-white px-3 py-2 rounded-[var(--radius-md)] shadow-lg text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-gold font-tabular">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export default function DashboardCharts({
  collectionRate,
}: {
  collectionRate: number;
}) {
  const chartData = [
    { month: "Apr", revenue: 4500000, isCurrent: false },
    { month: "May", revenue: 5200000, isCurrent: false },
    { month: "Jun", revenue: 4800000, isCurrent: false },
    { month: "Jul", revenue: 5800000, isCurrent: false },
    { month: "Aug", revenue: 5500000, isCurrent: false },
    { month: "Sep", revenue: 6200000, isCurrent: true },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-surface rounded-[var(--radius-lg)] border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Monthly Revenue</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888176", fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(200,155,74,0.06)" }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isCurrent ? "#C89B4A" : "#222529"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Collection Status</h3>
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F1EEE6" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#237A57"
                strokeWidth="12"
                strokeDasharray={`${collectionRate * 2.51} ${(100 - collectionRate) * 2.51}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-text-primary">{collectionRate}%</span>
              <span className="text-xs text-text-3">Collected</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-text-3">Collected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-surface-2" />
              <span className="text-xs text-text-3">Outstanding</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
