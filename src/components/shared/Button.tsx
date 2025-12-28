"use client";

import Link from "next/link";
import clsx from "clsx";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "accent";
  loading?: boolean;
  href?: string;
  prefetch?: boolean;
  target?: string;
  rel?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      loading = false,
      disabled,
      href,
      prefetch,
      target,
      rel,
      ...rest
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] focus-visible:outline-[color:var(--primary)]",
      secondary:
        "bg-[color:var(--surface)] text-[color:var(--primary-dark)] hover:bg-[color:var(--surface-alt)] focus-visible:outline-[color:var(--surface-alt)]",
      ghost:
        "bg-transparent text-[color:var(--muted)] hover:bg-[color:var(--surface)] focus-visible:outline-[color:var(--primary)]",
      accent:
        "bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-dark)] focus-visible:outline-[color:var(--accent)]",
    };

    const composedClassName = clsx(
      baseStyles,
      variants[variant],
      "px-5 py-2 text-sm md:text-base",
      className
    );

    const { onClick, ...buttonProps } = rest;

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
            onClick?.(event as never);
          }}
        >
          {loading ? "Processing..." : children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={composedClassName}
        {...buttonProps}
      >
        {loading ? "Processing..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
