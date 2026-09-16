"use client";

export default function DashboardCharts({
  collectionRate,
}: {
  collectionRate: number;
}) {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const heights = [65, 72, 60, 80, 75, 87];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-surface rounded-[var(--radius-lg)] border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Monthly Revenue</h3>
        <div className="h-64 flex items-end justify-between gap-2 px-2">
          {months.map((month, i) => {
            const isCurrent = i === 5;
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-[var(--radius-sm)] transition-all duration-500"
                  style={{
                    height: `${heights[i]}%`,
                    backgroundColor: isCurrent ? "#C89B4A" : "#222529",
                  }}
                />
                <span className="text-xs text-text-3">{month}</span>
              </div>
            );
          })}
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
