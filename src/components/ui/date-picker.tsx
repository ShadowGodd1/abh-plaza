import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, id, value, onChange, disabled, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            "w-full h-10 px-3 text-sm bg-surface border rounded-[var(--radius-md)]",
            "text-text-primary placeholder:text-text-3",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60",
            error
              ? "border-danger focus:ring-danger"
              : "border-border hover:border-border-strong",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
export default DatePicker;
