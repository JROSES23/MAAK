"use client";

import { useState, useMemo } from "react";
import {
  ShoppingCart,
  Plus,
  FileSpreadsheet,
  MessageSquare,
  Trash2,
  Copy,
  Check,
  Package,
  DollarSign,
  Award,
  Edit2,
  Save,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/ui/DataTable";
import {
  pedidosMock,
  proveedores,
  productos,
  sucursales,
} from "@/lib/mock-data";
import { formatCLP, formatDate } from "@/lib/utils";
import { exportPedidoToExcel, generateWhatsAppText } from "@/lib/excel-export";
import type { Pedido, EstadoPedido } from "@/lib/types";

const estadoBadge: Record<EstadoPedido, "info" | "warning" | "success" | "danger" | "accent"> = {
  borrador: "warning",
  pendiente: "accent",
  enviado: "info",
  recibido: "success",
  cancelado: "danger",
};

const ESTADO_LABELS: Record<EstadoPedido, string> = {
  borrador: "Borrador",
  pendiente: "Pendiente",
  enviado: "Enviado",
  recibido: "Recibido",
  cancelado: "Cancelado",
};

const ALL_ESTADOS: EstadoPedido[] = ["borrador", "pendiente", "enviado", "recibido", "cancelado"];
const EDITABLE_STATES: EstadoPedido[] = ["borrador", "pendiente"];

function isEditable(estado: EstadoPedido): boolean {
  return EDITABLE_STATES.includes(estado);
}

interface FormItem {
  producto_id: string;
  cantidad: number;
  unidad: string;
  precio_estimado: number;
  sucursal_id: string;
}

interface FormData {
  proveedor_id: string;
  sucursal_id: string;
  fecha: string;
  notas: string;
  estado: EstadoPedido;
  items: FormItem[];
}

function getEmptyForm(): FormData {
  return {
    proveedor_id: proveedores[0].id,
    sucursal_id: sucursales[0].id,
    fecha: new Date().toISOString().split("T")[0],
    notas: "",
    estado: "borrador",
    items: [
      {
        producto_id: productos[0].id,
        cantidad: 1,
        unidad: productos[0].unidad_default,
        precio_estimado: 0,
        sucursal_id: sucursales[0].id,
      },
    ],
  };
}

function pedidoToForm(pedido: Pedido): FormData {
  return {
    proveedor_id: pedido.proveedor_id,
    sucursal_id: pedido.sucursal_id,
    fecha: pedido.fecha,
    notas: pedido.notas,
    estado: pedido.estado,
    items: pedido.items.map((item) => ({
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      unidad: item.unidad,
      precio_estimado: item.precio_estimado,
      sucursal_id: item.sucursal_id,
    })),
  };
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosMock);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPedidoId, setEditingPedidoId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(getEmptyForm());

  // Stats
  const totalPedidos = pedidos.length;
  const montoEstimadoMes = pedidos.reduce((sum, p) => sum + p.total_estimado, 0);
  const topProveedor = useMemo(() => {
    const byProv: Record<string, number> = {};
    pedidos.forEach((p) => {
      const name = p.proveedor?.nombre || "Desconocido";
      byProv[name] = (byProv[name] || 0) + p.total_estimado;
    });
    const sorted = Object.entries(byProv).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? sorted[0][0] : "\u2014";
  }, [pedidos]);

  const formTotal = formData.items.reduce((s, i) => s + i.cantidad * i.precio_estimado, 0);

  // Open create modal
  const openCreate = () => {
    setModalMode("create");
    setEditingPedidoId(null);
    setFormData(getEmptyForm());
    setShowModal(true);
  };

  // Open edit modal
  const openEdit = (pedido: Pedido) => {
    setModalMode("edit");
    setEditingPedidoId(pedido.id);
    setFormData(pedidoToForm(pedido));
    setShowModal(true);
  };

  // Add item to form
  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          producto_id: productos[0].id,
          cantidad: 1,
          unidad: productos[0].unidad_default,
          precio_estimado: 0,
          sucursal_id: sucursales[0].id,
        },
      ],
    });
  };

  // Remove item from form
  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  // Update form item
  const updateItem = (index: number, updates: Partial<FormItem>) => {
    const items = [...formData.items];
    items[index] = { ...items[index], ...updates };
    setFormData({ ...formData, items });
  };

  // Save (create or edit)
  const handleSave = () => {
    const prov = proveedores.find((p) => p.id === formData.proveedor_id);
    const suc = sucursales.find((s) => s.id === formData.sucursal_id);

    if (modalMode === "create") {
      const newId = `ped${Date.now()}`;
      const newP: Pedido = {
        id: newId,
        fecha: formData.fecha,
        proveedor_id: formData.proveedor_id,
        proveedor: prov,
        sucursal_id: formData.sucursal_id,
        sucursal: suc,
        estado: "borrador",
        notas: formData.notas,
        total_estimado: formTotal,
        items: formData.items.map((item, idx) => ({
          id: `pi${Date.now()}_${idx}`,
          pedido_id: newId,
          producto_id: item.producto_id,
          producto: productos.find((p) => p.id === item.producto_id),
          cantidad: item.cantidad,
          unidad: item.unidad,
          precio_estimado: item.precio_estimado,
          sucursal_id: item.sucursal_id,
          sucursal: sucursales.find((s) => s.id === item.sucursal_id),
        })),
      };
      setPedidos([newP, ...pedidos]);
    } else if (editingPedidoId) {
      const pedidoId = editingPedidoId;
      setPedidos(
        pedidos.map((p) => {
          if (p.id !== pedidoId) return p;
          return {
            ...p,
            fecha: formData.fecha,
            proveedor_id: formData.proveedor_id,
            proveedor: prov,
            sucursal_id: formData.sucursal_id,
            sucursal: suc,
            estado: formData.estado,
            notas: formData.notas,
            total_estimado: formTotal,
            items: formData.items.map((item, idx) => ({
              id: `pi${Date.now()}_${idx}`,
              pedido_id: pedidoId,
              producto_id: item.producto_id,
              producto: productos.find((pr) => pr.id === item.producto_id),
              cantidad: item.cantidad,
              unidad: item.unidad,
              precio_estimado: item.precio_estimado,
              sucursal_id: item.sucursal_id,
              sucursal: sucursales.find((s) => s.id === item.sucursal_id),
            })),
          };
        })
      );
    }
    setShowModal(false);
  };

  // Inline status change
  const handleStatusChange = (pedidoId: string, newEstado: EstadoPedido) => {
    setPedidos(
      pedidos.map((p) => (p.id === pedidoId ? { ...p, estado: newEstado } : p))
    );
  };

  // Delete pedido
  const handleDeletePedido = (id: string) => {
    setPedidos(pedidos.filter((p) => p.id !== id));
  };

  const handleCopyWhatsApp = () => {
    if (!selectedPedido) return;
    const text = generateWhatsAppText(selectedPedido);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pedidos"
        subtitle="Gestion de pedidos a proveedores"
        icon={ShoppingCart}
        action={
          <Button icon={Plus} onClick={openCreate}>
            Nuevo pedido
          </Button>
        }
      />

      {/* Mini dashboard */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total pedidos"
          value={totalPedidos.toString()}
          sublabel="Este mes"
          icon={Package}
        />
        <StatCard
          label="Monto estimado"
          value={formatCLP(montoEstimadoMes)}
          sublabel="Marzo 2026"
          icon={DollarSign}
        />
        <StatCard
          label="Top proveedor"
          value={topProveedor}
          sublabel="Por monto"
          icon={Award}
        />
      </div>

      {/* Tabla de pedidos */}
      <DataTable
        columns={[
          {
            key: "fecha",
            header: "Fecha",
            render: (p: Pedido) => (
              <span className="text-sm text-[var(--color-text)]">
                {formatDate(p.fecha)}
              </span>
            ),
          },
          {
            key: "proveedor",
            header: "Proveedor",
            render: (p: Pedido) => (
              <span className="text-sm font-medium text-[var(--color-text)]">
                {p.proveedor?.nombre || "\u2014"}
              </span>
            ),
          },
          {
            key: "sucursal",
            header: "Sucursal",
            render: (p: Pedido) => (
              <span className="text-sm text-[var(--color-text-secondary)]">
                {p.sucursal?.nombre || "\u2014"}
              </span>
            ),
          },
          {
            key: "items",
            header: "Items",
            render: (p: Pedido) => (
              <span className="text-sm text-[var(--color-muted)]">
                {p.items.length} productos
              </span>
            ),
          },
          {
            key: "total",
            header: "Total est.",
            render: (p: Pedido) => (
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {formatCLP(p.total_estimado)}
              </span>
            ),
          },
          {
            key: "estado",
            header: "Estado",
            render: (p: Pedido) =>
              isEditable(p.estado) ? (
                <select
                  value={p.estado}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleStatusChange(p.id, e.target.value as EstadoPedido);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs font-medium text-[var(--color-text)] focus:outline-none"
                >
                  {ALL_ESTADOS.map((est) => (
                    <option key={est} value={est}>
                      {ESTADO_LABELS[est]}
                    </option>
                  ))}
                </select>
              ) : (
                <Badge variant={estadoBadge[p.estado]}>
                  {ESTADO_LABELS[p.estado]}
                </Badge>
              ),
          },
          {
            key: "acciones",
            header: "",
            render: (p: Pedido) => (
              <div className="flex items-center gap-1">
                {isEditable(p.estado) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(p);
                    }}
                    className="rounded-lg p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-accent)]"
                    title="Editar pedido"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exportPedidoToExcel(p);
                  }}
                  className="rounded-lg p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-accent)]"
                  title="Exportar a Excel"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPedido(p);
                    setShowWhatsApp(true);
                  }}
                  className="rounded-lg p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-emerald-400"
                  title="Texto WhatsApp"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                {isEditable(p.estado) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePedido(p.id);
                    }}
                    className="rounded-lg p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-red-400"
                    title="Eliminar pedido"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ),
          },
        ]}
        data={pedidos}
        keyExtractor={(p) => p.id}
        onRowClick={(p) => setSelectedPedido(p)}
      />

      {/* Modal: Create / Edit pedido */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === "create" ? "Nuevo pedido" : "Editar pedido"}
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Proveedor */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Proveedor
              </label>
              <select
                value={formData.proveedor_id}
                onChange={(e) =>
                  setFormData({ ...formData, proveedor_id: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              >
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Sucursal */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Sucursal destino
              </label>
              <select
                value={formData.sucursal_id}
                onChange={(e) =>
                  setFormData({ ...formData, sucursal_id: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              >
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Fecha
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) =>
                  setFormData({ ...formData, fecha: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>

            {/* Estado (solo en edicion) */}
            {modalMode === "edit" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado: e.target.value as EstadoPedido,
                    })
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

          {/* Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Productos
              </label>
              <Button
                variant="ghost"
                size="sm"
                icon={Plus}
                onClick={handleAddItem}
              >
                Agregar item
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {formData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-alt)] p-3"
                >
                  <select
                    value={item.producto_id}
                    onChange={(e) => {
                      const prod = productos.find(
                        (p) => p.id === e.target.value
                      );
                      updateItem(idx, {
                        producto_id: e.target.value,
                        unidad: prod?.unidad_default || item.unidad,
                      });
                    }}
                    className="flex-1 min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
                  >
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) =>
                      updateItem(idx, {
                        cantidad: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Cant."
                    className="w-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.unidad}
                    onChange={(e) =>
                      updateItem(idx, { unidad: e.target.value })
                    }
                    className="w-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
                  />
                  <input
                    type="number"
                    value={item.precio_estimado}
                    onChange={(e) =>
                      updateItem(idx, {
                        precio_estimado: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Precio"
                    className="w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
                  />
                  <select
                    value={item.sucursal_id}
                    onChange={(e) =>
                      updateItem(idx, { sucursal_id: e.target.value })
                    }
                    className="w-32 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none"
                  >
                    {sucursales.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="rounded-lg p-1 text-[var(--color-muted)] hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) =>
                setFormData({ ...formData, notas: e.target.value })
              }
              rows={2}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none resize-none"
              placeholder="Notas adicionales del pedido..."
            />
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

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button
              icon={modalMode === "edit" ? Save : undefined}
              onClick={handleSave}
            >
              {modalMode === "create" ? "Crear pedido" : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: WhatsApp text */}
      <Modal
        open={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        title="Texto para WhatsApp"
      >
        {selectedPedido && (
          <div className="space-y-4">
            <textarea
              readOnly
              value={generateWhatsAppText(selectedPedido)}
              rows={12}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text)] font-mono resize-none"
            />
            <div className="flex justify-end">
              <Button
                icon={copied ? Check : Copy}
                variant={copied ? "secondary" : "primary"}
                onClick={handleCopyWhatsApp}
              >
                {copied ? "Copiado" : "Copiar al portapapeles"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
