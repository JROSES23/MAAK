"use client";

import { useState } from "react";
import { formatCLP, percentage } from "@/lib/utils";
import type { PresupuestoMensual } from "@/lib/types";

interface BudgetDonutProps {
  budget: PresupuestoMensual;
  onUpdateTotal?: (total: number) => void;
}

const CATEGORIES = [
  { key: "remuneraciones" as const, label: "Remuneraciones", color: "#f4a7bb" },
  { key: "pedidos" as const, label: "Pedidos", color: "#98d4bb" },
  { key: "gastos_admin" as const, label: "Gastos Admin.", color: "#c3a6d8" },
  { key: "otros" as const, label: "Otros", color: "#8ec5e8" },
];

export function BudgetDonut({ budget, onUpdateTotal }: BudgetDonutProps) {
  const [editingTotal, setEditingTotal] = useState(false);
  const [tempTotal, setTempTotal] = useState(budget.total.toString());

  const spent = budget.remuneraciones + budget.pedidos + budget.gastos_admin + budget.otros;
  const remaining = budget.total - spent;
  const spentPercent = percentage(spent, budget.total);

  // Calcular los arcos del donut
  const segments = CATEGORIES.map((cat) => ({
    ...cat,
    value: budget[cat.key],
    percent: percentage(budget[cat.key], budget.total),
  }));

  // SVG donut con segmentos
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  const handleSaveTotal = () => {
    const num = parseInt(tempTotal);
    if (!isNaN(num) && num > 0) {
      onUpdateTotal?.(num);
    }
    setEditingTotal(false);
  };

  return (
    <div className="rounded-squircle border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            Presupuesto mensual
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Marzo 2026
          </p>
        </div>
        {editingTotal ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempTotal}
              onChange={(e) => setTempTotal(e.target.value)}
              className="w-32 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-1 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSaveTotal}
              className="rounded-lg bg-[var(--color-accent)] px-2 py-1 text-xs font-medium text-[var(--color-bg)]"
            >
              OK
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setTempTotal(budget.total.toString());
              setEditingTotal(true);
            }}
            className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
          >
            {formatCLP(budget.total)}
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Donut SVG */}
        <div className="relative flex-shrink-0">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Fondo del donut */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="var(--color-surface-alt)"
              strokeWidth="24"
            />
            {/* Segmentos */}
            {segments.map((seg) => {
              const segLength = (seg.value / budget.total) * circumference;
              const offset = accumulatedOffset;
              accumulatedOffset += segLength;
              return (
                <circle
                  key={seg.key}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="24"
                  strokeDasharray={`${segLength} ${circumference - segLength}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          {/* Centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[var(--color-text)]">
              {spentPercent}%
            </span>
            <span className="text-xs text-[var(--color-muted)]">utilizado</span>
          </div>
        </div>

        {/* Leyenda y desglose */}
        <div className="flex-1 space-y-3 w-full">
          {segments.map((seg) => (
            <div key={seg.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {seg.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {formatCLP(seg.value)}
                </span>
                <span className="ml-2 text-xs text-[var(--color-muted)]">
                  {seg.percent}%
                </span>
              </div>
            </div>
          ))}

          {/* Separador */}
          <div className="border-t border-[var(--color-border)] pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-accent)]">
                Disponible
              </span>
              <span className="text-sm font-bold text-[var(--color-accent)]">
                {formatCLP(remaining)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
