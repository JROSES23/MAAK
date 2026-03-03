"use client";

import { Search, X } from "lucide-react";
import type { Proveedor, EstadoPedido } from "@/lib/types";
import type { Branch } from "@/store/useBranchesStore";

const ESTADO_LABELS: Record<EstadoPedido, string> = {
  borrador: "Borrador",
  pendiente: "Pendiente",
  enviado: "Enviado",
  recibido: "Recibido",
  cancelado: "Cancelado",
};
const ALL_ESTADOS: EstadoPedido[] = [
  "borrador",
  "pendiente",
  "enviado",
  "recibido",
  "cancelado",
];

export interface PedidosFilters {
  proveedor_id: string;
  sucursal_id: string;
  estado: string;
  fecha_desde: string;
  fecha_hasta: string;
  monto_min: string;
  monto_max: string;
  search: string;
}

export const EMPTY_FILTERS: PedidosFilters = {
  proveedor_id: "",
  sucursal_id: "",
  estado: "",
  fecha_desde: "",
  fecha_hasta: "",
  monto_min: "",
  monto_max: "",
  search: "",
};

interface PedidosFiltrosProps {
  filters: PedidosFilters;
  onChange: (filters: PedidosFilters) => void;
  proveedores: Proveedor[];
  sucursales: Branch[];
}

export function PedidosFiltros({
  filters,
  onChange,
  proveedores,
  sucursales,
}: PedidosFiltrosProps) {
  const update = (partial: Partial<PedidosFilters>) =>
    onChange({ ...filters, ...partial });

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          Filtros
        </span>
        {hasFilters && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
          >
            <X className="h-3 w-3" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Busqueda */}
        <div className="relative sm:col-span-2 lg:col-span-4">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Buscar por notas o proveedor..."
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-8 pr-3 text-xs text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none"
          />
        </div>

        {/* Proveedor */}
        <select
          value={filters.proveedor_id}
          onChange={(e) => update({ proveedor_id: e.target.value })}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] focus:outline-none"
        >
          <option value="">Todos los proveedores</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        {/* Sucursal */}
        <select
          value={filters.sucursal_id}
          onChange={(e) => update({ sucursal_id: e.target.value })}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] focus:outline-none"
        >
          <option value="">Todas las sucursales</option>
          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>

        {/* Estado */}
        <select
          value={filters.estado}
          onChange={(e) => update({ estado: e.target.value })}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] focus:outline-none"
        >
          <option value="">Todos los estados</option>
          {ALL_ESTADOS.map((est) => (
            <option key={est} value={est}>
              {ESTADO_LABELS[est]}
            </option>
          ))}
        </select>

        {/* Fecha desde */}
        <div className="space-y-1">
          <label className="text-[10px] text-[var(--color-muted)]">
            Desde
          </label>
          <input
            type="date"
            value={filters.fecha_desde}
            onChange={(e) => update({ fecha_desde: e.target.value })}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
          />
        </div>

        {/* Fecha hasta */}
        <div className="space-y-1">
          <label className="text-[10px] text-[var(--color-muted)]">
            Hasta
          </label>
          <input
            type="date"
            value={filters.fecha_hasta}
            onChange={(e) => update({ fecha_hasta: e.target.value })}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
          />
        </div>

        {/* Monto min */}
        <div className="space-y-1">
          <label className="text-[10px] text-[var(--color-muted)]">
            Monto min
          </label>
          <input
            type="number"
            value={filters.monto_min}
            onChange={(e) => update({ monto_min: e.target.value })}
            placeholder="0"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
          />
        </div>

        {/* Monto max */}
        <div className="space-y-1">
          <label className="text-[10px] text-[var(--color-muted)]">
            Monto max
          </label>
          <input
            type="number"
            value={filters.monto_max}
            onChange={(e) => update({ monto_max: e.target.value })}
            placeholder="Sin limite"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
