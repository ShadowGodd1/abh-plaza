import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
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
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full h-10 px-3 text-sm bg-surface border rounded-[var(--radius-md)]",
            "text-text-primary appearance-none",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-danger focus:ring-danger"
              : "border-border hover:border-border-strong",
            className
          )}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-text-3">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
