import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6", className)}>
      {icon && (
        <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-surface-2 flex items-center justify-center text-text-3 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-3 text-center max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
