"use client";

import { type LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="rounded-xl bg-[var(--color-accent)]/10 p-2">
            <Icon className="h-5 w-5 text-[var(--color-accent)]" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">{title}</h2>
          {subtitle && (
            <p className="text-sm text-[var(--color-text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
