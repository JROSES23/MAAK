"use client";

import { Trash2 } from "lucide-react";
import type { Producto } from "@/lib/types";
import type { Branch } from "@/store/useBranchesStore";

export interface FormItem {
  producto_id: string;
  producto_nombre: string; // Para productos nuevos que aun no tienen ID
  cantidad: number;
  unidad: string;
  precio_estimado: number;
  sucursal_id: string;
}

interface ItemRowProps {
  item: FormItem;
  index: number;
  productos: Producto[];
  sucursales: Branch[];
  onUpdate: (index: number, updates: Partial<FormItem>) => void;
  onRemove: (index: number) => void;
}

export function ItemRow({
  item,
  index,
  productos,
  sucursales,
  onUpdate,
  onRemove,
}: ItemRowProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-alt)] p-3">
      {/* Producto (combobox simple) */}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          list={`productos-${index}`}
          value={item.producto_nombre || productos.find((p) => p.id === item.producto_id)?.nombre || ""}
          onChange={(e) => {
            const val = e.target.value;
            const match = productos.find(
              (p) => p.nombre.toLowerCase() === val.toLowerCase()
            );
            if (match) {
              onUpdate(index, {
                producto_id: match.id,
                producto_nombre: match.nombre,
                unidad: match.unidad_default,
              });
            } else {
              onUpdate(index, {
                producto_id: "",
                producto_nombre: val,
              });
            }
          }}
          placeholder="Producto"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
        />
        <datalist id={`productos-${index}`}>
          {productos.map((p) => (
            <option key={p.id} value={p.nombre} />
          ))}
        </datalist>
      </div>

      {/* Cantidad */}
      <input
        type="number"
        value={item.cantidad}
        onChange={(e) =>
          onUpdate(index, { cantidad: parseInt(e.target.value) || 0 })
        }
        placeholder="Cant."
        min={0}
        className="w-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
      />

      {/* Unidad */}
      <input
        type="text"
        value={item.unidad}
        onChange={(e) => onUpdate(index, { unidad: e.target.value })}
        placeholder="Unid."
        className="w-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
      />

      {/* Precio */}
      <input
        type="number"
        value={item.precio_estimado}
        onChange={(e) =>
          onUpdate(index, {
            precio_estimado: parseInt(e.target.value) || 0,
          })
        }
        placeholder="Precio"
        min={0}
        className="w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
      />

      {/* Sucursal destino */}
      <select
        value={item.sucursal_id}
        onChange={(e) => onUpdate(index, { sucursal_id: e.target.value })}
        className="w-32 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
      >
        {sucursales.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre}
          </option>
        ))}
      </select>

      {/* Eliminar */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="rounded-lg p-1 text-[var(--color-muted)] hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
