import clsx from "clsx";
import { type HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-[color:var(--border)] bg-[color:var(--background-strong)] shadow-[0_20px_40px_-24px_rgba(15,23,42,0.3)]",
        className
      )}
      {...props}
    />
  );
}
