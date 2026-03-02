"use client";

import { Building2, TrendingUp, ShoppingCart } from "lucide-react";
import { formatCLP, percentage } from "@/lib/utils";
import { sucursales } from "@/lib/mock-data";

interface BranchStats {
  sucursal_id: string;
  nombre: string;
  gasto_mes: number;
  presupuesto: number;
  pedidos_abiertos: number;
}

const branchStatsMock: BranchStats[] = [
  {
    sucursal_id: "s1",
    nombre: "Casa Matriz",
    gasto_mes: 2850000,
    presupuesto: 3500000,
    pedidos_abiertos: 3,
  },
  {
    sucursal_id: "s2",
    nombre: "Sucursal Centro",
    gasto_mes: 1620000,
    presupuesto: 2500000,
    pedidos_abiertos: 2,
  },
  {
    sucursal_id: "s3",
    nombre: "Sucursal Norte",
    gasto_mes: 980000,
    presupuesto: 2000000,
    pedidos_abiertos: 1,
  },
];

export function BranchSummaryGrid() {
  return (
    <div className="rounded-squircle border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
        Resumen por sucursal
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {branchStatsMock.map((branch) => {
          const pct = percentage(branch.gasto_mes, branch.presupuesto);
          const barColor =
            pct >= 90
              ? "bg-red-400"
              : pct >= 70
              ? "bg-amber-400"
              : "bg-[var(--color-accent)]";

          return (
            <div
              key={branch.sucursal_id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[var(--color-accent)]" />
                <h4 className="text-sm font-semibold text-[var(--color-text)]">
                  {branch.nombre}
                </h4>
              </div>

              {/* Gasto */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-muted)]">Gasto del mes</span>
                  <span className="font-medium text-[var(--color-text)]">
                    {formatCLP(branch.gasto_mes)}
                  </span>
                </div>
                {/* Barra de progreso */}
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-[var(--color-muted)]">
                  <span>{pct}% del presupuesto</span>
                  <span>{formatCLP(branch.presupuesto)}</span>
                </div>
              </div>

              {/* Pedidos */}
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>{branch.pedidos_abiertos} pedidos abiertos</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
