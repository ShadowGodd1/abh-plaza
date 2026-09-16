import { forwardRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, error, id, value = "", onChange, disabled }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value;

        raw = raw.replace(/[^\d]/g, "");

        if (raw.startsWith("254")) {
          raw = raw.slice(0, 12);
        } else if (raw.startsWith("7") || raw.startsWith("1")) {
          raw = "254" + raw;
          raw = raw.slice(0, 12);
        } else if (raw.length > 0) {
          return;
        }

        onChange?.(raw);
      },
      [onChange]
    );

    const displayValue = value.startsWith("254") ? value.slice(3) : value;
    const isValid =
      value.length === 12 &&
      value.startsWith("254") &&
      (value[3] === "7" || value[3] === "1");

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
        <div className="flex">
          <div
            className={cn(
              "flex items-center h-10 px-3 text-sm border border-r-0 rounded-l-[var(--radius-md)]",
              "bg-surface-2 text-text-2 font-medium select-none",
              error ? "border-danger" : "border-border"
            )}
          >
            +254
          </div>
          <input
            ref={ref}
            id={id}
            type="tel"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            disabled={disabled}
            placeholder="7XXXXXXXX"
            maxLength={9}
            className={cn(
              "flex-1 h-10 px-3 text-sm bg-surface border rounded-r-[var(--radius-md)]",
              "text-text-primary placeholder:text-text-3",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error || (displayValue.length > 0 && !isValid)
                ? "border-danger focus:ring-danger"
                : "border-border hover:border-border-strong",
              className
            )}
            aria-invalid={!!error || (displayValue.length > 0 && !isValid)}
            aria-describedby={
              error
                ? `${id}-error`
                : displayValue.length > 0 && !isValid
                ? `${id}-invalid`
                : undefined
            }
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="text-xs text-danger">
            {error}
          </p>
        )}
        {!error && displayValue.length > 0 && !isValid && (
          <p id={`${id}-invalid`} className="text-xs text-danger">
            Enter a valid Kenyan phone number
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
