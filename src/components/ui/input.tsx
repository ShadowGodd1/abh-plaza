import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
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
          className={cn(
            "w-full h-10 px-3 text-sm bg-surface border rounded-[var(--radius-md)]",
            "text-text-primary placeholder:text-text-3",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-danger focus:ring-danger"
              : "border-border hover:border-border-strong",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-xs text-danger">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="text-xs text-text-3">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
