"use client";

import Link from "next/link";
import clsx from "clsx";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "accent" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  href?: string;
  prefetch?: boolean;
  target?: string;
  rel?: string;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      href,
      prefetch,
      target,
      rel,
      fullWidth = false,
      ...rest
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary-dark)] focus-visible:outline-[color:var(--primary)] shadow-sm hover:shadow-md",
      secondary:
        "bg-[color:var(--surface-alt)] text-[color:var(--foreground)] hover:bg-[color:var(--border)] focus-visible:outline-[color:var(--border)]",
      ghost:
        "bg-transparent text-[color:var(--muted)] hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--foreground)] focus-visible:outline-[color:var(--primary)]",
      accent:
        "bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:bg-[color:var(--accent-dark)] focus-visible:outline-[color:var(--accent)] shadow-sm hover:shadow-md",
      outline:
        "bg-transparent border border-[color:var(--border)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-alt)] focus-visible:outline-[color:var(--primary)]",
      destructive:
        "bg-[color:var(--destructive)] text-white hover:bg-red-600 focus-visible:outline-[color:var(--destructive)]",
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3.5 text-base",
    };

    const composedClassName = clsx(
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      className
    );

    const content = (
      <>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          prefetch={prefetch}
          className={clsx(composedClassName, "no-underline")}
          aria-disabled={disabled || loading}
          target={target}
          rel={rel}
          onClick={(event) => {
            if (disabled || loading) {
              event.preventDefault();
            }
            rest.onClick?.(event as never);
          }}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={composedClassName}
        {...rest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
