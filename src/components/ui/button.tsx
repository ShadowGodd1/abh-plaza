"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-gold text-ink hover:bg-gold-light active:bg-gold-dark": variant === "primary",
            "bg-surface border border-border text-text-primary hover:bg-surface-2 active:bg-border": variant === "secondary",
            "bg-transparent text-text-2 hover:text-text-primary hover:bg-surface-2": variant === "tertiary",
            "bg-danger text-white hover:bg-danger/90 active:bg-danger/80": variant === "danger",
          },
          {
            "h-8 px-3 text-sm rounded-[var(--radius-sm)]": size === "sm",
            "h-10 px-4 text-sm rounded-[var(--radius-md)]": size === "md",
            "h-12 px-6 text-base rounded-[var(--radius-md)]": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
