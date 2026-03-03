"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProveedorSelect } from "./ProveedorSelect";
import { ItemRow, type FormItem } from "./ItemRow";
import { formatCLP } from "@/lib/utils";
import type { Pedido, Proveedor, Producto, EstadoPedido } from "@/lib/types";
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

interface NuevoPedidoModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  pedido?: Pedido;
  proveedores: Proveedor[];
  productos: Producto[];
  sucursales: Branch[];
  onSave: (data: {
    proveedor_id: string;
    sucursal_id: string;
    fecha: string;
    notas: string;
    estado: EstadoPedido;
    total_estimado: number;
    items: FormItem[];
  }) => Promise<void>;
  onCreateProveedor: (
    prov: Omit<Proveedor, "id" | "created_at">
  ) => Promise<Proveedor | null>;
}

function getEmptyItem(sucursal_id: string): FormItem {
  return {
    producto_id: "",
    producto_nombre: "",
    cantidad: 1,
    unidad: "un",
    precio_estimado: 0,
    sucursal_id,
  };
}

export function NuevoPedidoModal({
  open,
  onClose,
  mode,
  pedido,
  proveedores,
  productos,
  sucursales,
  onSave,
  onCreateProveedor,
}: NuevoPedidoModalProps) {
  const defaultSucursalId = sucursales[0]?.id || "";

  const [proveedorId, setProveedorId] = useState(
    pedido?.proveedor_id || proveedores[0]?.id || ""
  );
  const [sucursalId, setSucursalId] = useState(
    pedido?.sucursal_id || defaultSucursalId
  );
  const [fecha, setFecha] = useState(
    pedido?.fecha || new Date().toISOString().split("T")[0]
  );
  const [notas, setNotas] = useState(pedido?.notas || "");
  const [estado, setEstado] = useState<EstadoPedido>(
    pedido?.estado || "borrador"
  );
  const [items, setItems] = useState<FormItem[]>(
    pedido?.items?.map((item) => ({
      producto_id: item.producto_id,
      producto_nombre: item.producto?.nombre || "",
      cantidad: item.cantidad,
      unidad: item.unidad,
      precio_estimado: item.precio_estimado,
      sucursal_id: item.sucursal_id,
    })) || [getEmptyItem(defaultSucursalId)]
  );
  const [saving, setSaving] = useState(false);

  const formTotal = items.reduce(
    (s, i) => s + i.cantidad * i.precio_estimado,
    0
  );

  const handleAddItem = () => {
    setItems([...items, getEmptyItem(sucursalId)]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updates: Partial<FormItem>) => {
    const updated = [...items];
    updated[index] = { ...updated[index], ...updates };
    setItems(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      proveedor_id: proveedorId,
      sucursal_id: sucursalId,
      fecha,
      notas,
      estado,
      total_estimado: formTotal,
      items,
    });
    setSaving(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        {/* Header (fixed) */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {mode === "create" ? "Nuevo pedido" : "Editar pedido"}
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              {mode === "create"
                ? "Crea un nuevo pedido a proveedor"
                : "Modifica los datos del pedido"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Campos generales */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Proveedor
              </label>
              <ProveedorSelect
                proveedores={proveedores}
                value={proveedorId}
                onChange={setProveedorId}
                onCreateNew={onCreateProveedor}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Sucursal destino
              </label>
              <select
                value={sucursalId}
                onChange={(e) => setSucursalId(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              >
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>

            {mode === "edit" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                  Estado
                </label>
                <select
                  value={estado}
                  onChange={(e) =>
                    setEstado(e.target.value as EstadoPedido)
                  }
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                >
                  {ALL_ESTADOS.map((est) => (
                    <option key={est} value={est}>
                      {ESTADO_LABELS[est]}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">
              Notas
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none"
              placeholder="Notas adicionales del pedido..."
            />
          </div>

          {/* Items */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">
              Productos
            </label>

            {items.map((item, idx) => (
              <ItemRow
                key={idx}
                item={item}
                index={idx}
                productos={productos}
                sucursales={sucursales}
                onUpdate={handleUpdateItem}
                onRemove={handleRemoveItem}
              />
            ))}

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar item
            </button>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              Total estimado
            </span>
            <span className="text-lg font-bold text-[var(--color-accent)]">
              {formatCLP(formTotal)}
            </span>
          </div>
        </div>

        {/* Footer (fixed) */}
        <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] px-6 py-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || items.length === 0}>
            {saving
              ? "Guardando..."
              : mode === "create"
              ? "Crear pedido"
              : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
