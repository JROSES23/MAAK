"use client";

import { Edit2, UserX, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getInitials, formatCLP } from "@/lib/utils";
import type { Trabajador } from "@/lib/types";

const ROL_LABELS: Record<string, string> = {
  vendedor: "Vendedor",
  bodeguero: "Bodeguero",
  cajero: "Cajero",
  jefe_sucursal: "Jefe Sucursal",
  administrador: "Administrador",
  auxiliar: "Auxiliar",
};

interface TrabajadorCardProps {
  trabajador: Trabajador;
  onEdit: (t: Trabajador) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TrabajadorCard({
  trabajador,
  onEdit,
  onDeactivate,
  onDelete,
}: TrabajadorCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-sm font-bold text-[var(--color-accent)]">
          {getInitials(trabajador.nombre)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--color-text)] truncate">
            {trabajador.nombre}
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            {ROL_LABELS[trabajador.rol] || trabajador.rol} — {formatCLP(trabajador.sueldo_base)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-3">
        <Badge variant={trabajador.estado === "activo" ? "success" : "danger"}>
          {trabajador.estado}
        </Badge>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(trabajador)}
            className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)]"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          {trabajador.estado === "activo" && (
            <button
              onClick={() => onDeactivate(trabajador.id)}
              className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-amber-400"
              title="Desactivar"
            >
              <UserX className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(trabajador.id)}
            className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-red-400"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
