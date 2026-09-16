import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full min-h-[80px] px-3 py-2 text-sm bg-surface border rounded-[var(--radius-md)]",
            "text-text-primary placeholder:text-text-3 resize-y",
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
        />
        {error && (
          <p className="text-xs text-danger">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-3">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
