import clsx from "clsx";
import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "primary" | "accent" | "neutral" | "warning";
}

export function Badge({ tone = "primary", className, ...props }: BadgeProps) {
  const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
    primary: "bg-[color:var(--surface-alt)] text-[color:var(--primary-dark)]",
    accent: "bg-[color:var(--accent)]/15 text-[color:var(--accent-dark)]",
    neutral: "bg-[color:var(--surface)] text-[color:var(--muted)]",
    warning: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
