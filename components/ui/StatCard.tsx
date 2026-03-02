"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-squircle border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </p>
          <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
          {sublabel && (
            <p className="text-xs text-[var(--color-muted)]">{sublabel}</p>
          )}
        </div>
        <div className="rounded-xl bg-[var(--color-accent)]/10 p-2.5">
          <Icon className="h-5 w-5 text-[var(--color-accent)]" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              "text-xs font-medium",
              trend.positive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {trend.positive ? "+" : ""}
            {trend.value}
          </span>
          <span className="text-xs text-[var(--color-muted)]">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}
