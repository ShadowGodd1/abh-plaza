import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}

export default function MetricCard({ label, value, subtitle, icon, trend, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-[var(--radius-lg)] border border-border p-6",
        "hover:shadow-[var(--shadow-card)] transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-2 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-text-primary font-tabular">{value}</p>
          {subtitle && (
            <p className="text-sm text-text-3 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-[var(--radius-md)] bg-surface-2 flex items-center justify-center text-text-3">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-success" : "text-danger"
            )}
          >
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="text-xs text-text-3">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
