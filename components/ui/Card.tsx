"use client";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "accent";
  padding?: "sm" | "md" | "lg";
}

export function Card({
  className,
  variant = "default",
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-squircle border transition-all",
        {
          "bg-[var(--color-surface)] border-[var(--color-border)]":
            variant === "default",
          glass: variant === "glass",
          "bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20":
            variant === "accent",
        },
        {
          "p-3": padding === "sm",
          "p-5": padding === "md",
          "p-7": padding === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
