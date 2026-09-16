import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface MoneyDisplayProps {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showSign?: boolean;
}

export default function MoneyDisplay({ amount, className, size = "md", showSign }: MoneyDisplayProps) {
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  return (
    <span
      className={cn(
        "font-tabular font-medium",
        {
          "text-sm": size === "sm",
          "text-base": size === "md",
          "text-lg": size === "lg",
        },
        isNegative && "text-danger",
        className
      )}
    >
      {showSign && !isNegative && "+"}
      {isNegative && "-"}
      {formatCurrency(absoluteAmount)}
    </span>
  );
}
