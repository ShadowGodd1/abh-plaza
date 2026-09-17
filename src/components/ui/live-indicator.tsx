import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  className?: string;
  showLabel?: boolean;
}

export default function LiveIndicator({ className, showLabel = true }: LiveIndicatorProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
      </span>
      {showLabel && (
        <span className="text-xs font-medium text-success">Live</span>
      )}
    </span>
  );
}
