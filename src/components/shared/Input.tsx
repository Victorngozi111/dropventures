"use client";

import clsx from "clsx";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth = true, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={clsx("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[color:var(--foreground)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "rounded-xl border bg-[color:var(--input-bg)] px-4 py-2.5 text-sm text-[color:var(--foreground)] outline-none transition-all placeholder:text-[color:var(--muted-light)]",
            "focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20",
            error
              ? "border-[color:var(--destructive)] focus:border-[color:var(--destructive)] focus:ring-[color:var(--destructive)]/20"
              : "border-[color:var(--border)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-[color:var(--destructive)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
