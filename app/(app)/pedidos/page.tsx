"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/ui/DataTable";
import { NuevoPedidoModal } from "@/components/pedidos/NuevoPedidoModal";
import {
  PedidosFiltros,
  EMPTY_FILTERS,
  type PedidosFilters,
} from "@/components/pedidos/PedidosFiltros";
import type { FormItem } from "@/components/pedidos/ItemRow";
import { useBranchesStore } from "@/store/useBranchesStore";
import { usePedidos } from "@/hooks/usePedidos";
import { useProveedores } from "@/hooks/useProveedores";
import { useProductos } from "@/hooks/useProductos";
import { formatCLP, formatDate } from "@/lib/utils";
import { exportPedidoToExcel, generateWhatsAppText } from "@/lib/excel-export";
import type { Pedido, EstadoPedido, Proveedor } from "@/lib/types";

const estadoBadge: Record<
  EstadoPedido,
  "info" | "warning" | "success" | "danger" | "accent"
> = {
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

const ALL_ESTADOS: EstadoPedido[] = [
  "borrador",
  "pendiente",
  "enviado",
  "recibido",
  "cancelado",
];
const EDITABLE_STATES: EstadoPedido[] = ["borrador", "pendiente"];

function isEditable(estado: EstadoPedido): boolean {
  return EDITABLE_STATES.includes(estado);
}

export default function PedidosPage() {
  const branches = useBranchesStore((s) => s.branches);
  const {
    pedidos,
    loading: loadingPedidos,
    fetchPedidos,
    createPedido,
    updatePedido,
    changeEstado,
    deletePedido,
  } = usePedidos();
  const {
    proveedores,
    fetchProveedores,
    createProveedor,
  } = useProveedores();
  const { productos, fetchProductos, createProducto } = useProductos();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filters, setFilters] = useState<PedidosFilters>(EMPTY_FILTERS);

  // Load data on mount
  useEffect(() => {
    fetchPedidos();
    fetchProveedores();
    fetchProductos();
  }, [fetchPedidos, fetchProveedores, fetchProductos]);

  // Apply client-side filters
  const filteredPedidos = useMemo(() => {
    return pedidos.filter((p) => {
      if (
        filters.proveedor_id &&
        p.proveedor_id !== filters.proveedor_id
      )
        return false;
      if (filters.sucursal_id && p.sucursal_id !== filters.sucursal_id)
        return false;
      if (filters.estado && p.estado !== filters.estado) return false;
      if (filters.fecha_desde && p.fecha < filters.fecha_desde) return false;
      if (filters.fecha_hasta && p.fecha > filters.fecha_hasta) return false;
      if (filters.monto_min && p.total_estimado < parseInt(filters.monto_min))
        return false;
      if (filters.monto_max && p.total_estimado > parseInt(filters.monto_max))
        return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const matchNotas = p.notas?.toLowerCase().includes(s);
        const matchProv = p.proveedor?.nombre?.toLowerCase().includes(s);
        if (!matchNotas && !matchProv) return false;
      }
      return true;
    });
  }, [pedidos, filters]);

  // Stats
  const totalPedidos = filteredPedidos.length;
  const montoEstimadoMes = filteredPedidos.reduce(
    (sum, p) => sum + p.total_estimado,
    0
  );
  const topProveedor = useMemo(() => {
    const byProv: Record<string, number> = {};
    filteredPedidos.forEach((p) => {
      const name = p.proveedor?.nombre || "Desconocido";
      byProv[name] = (byProv[name] || 0) + p.total_estimado;
    });
    const sorted = Object.entries(byProv).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? sorted[0][0] : "\u2014";
  }, [filteredPedidos]);

  const openCreate = () => {
    setModalMode("create");
    setEditingPedido(null);
    setShowModal(true);
  };

  const openEdit = (pedido: Pedido) => {
    setModalMode("edit");
    setEditingPedido(pedido);
    setShowModal(true);
  };

  const handleSave = useCallback(
    async (data: {
      proveedor_id: string;
      sucursal_id: string;
      fecha: string;
      notas: string;
      estado: EstadoPedido;
      total_estimado: number;
      items: FormItem[];
    }) => {
      // Ensure all products exist
      const processedItems = [];
      for (const item of data.items) {
        let productoId = item.producto_id;
        if (!productoId && item.producto_nombre) {
          const created = await createProducto({
            nombre: item.producto_nombre,
            unidad_default: item.unidad || "un",
            categoria: "General",
          });
          if (created) productoId = created.id;
        }
        if (productoId) {
          processedItems.push({
            producto_id: productoId,
            cantidad: item.cantidad,
            unidad: item.unidad,
            precio_estimado: item.precio_estimado,
            sucursal_id: item.sucursal_id,
          });
        }
      }

      if (modalMode === "create") {
        await createPedido(
          {
            fecha: data.fecha,
            proveedor_id: data.proveedor_id,
            sucursal_id: data.sucursal_id,
            estado: "borrador",
            notas: data.notas,
            total_estimado: data.total_estimado,
          },
          processedItems
        );
      } else if (editingPedido) {
        await updatePedido(
          editingPedido.id,
          {
            fecha: data.fecha,
            proveedor_id: data.proveedor_id,
            sucursal_id: data.sucursal_id,
            estado: data.estado,
            notas: data.notas,
            total_estimado: data.total_estimado,
          },
          processedItems
        );
      }

      setShowModal(false);
      fetchPedidos();
    },
    [
      modalMode,
      editingPedido,
      createPedido,
      updatePedido,
      createProducto,
      fetchPedidos,
    ]
  );

  const handleCreateProveedor = useCallback(
    async (prov: Omit<Proveedor, "id" | "created_at">) => {
      return await createProveedor(prov);
    },
    [createProveedor]
  );

  const handleStatusChange = async (
    pedidoId: string,
    newEstado: EstadoPedido
  ) => {
    await changeEstado(pedidoId, newEstado);
  };

  const handleDeletePedido = async (id: string) => {
    await deletePedido(id);
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
          sublabel="Filtrados"
          icon={Package}
        />
        <StatCard
          label="Monto estimado"
          value={formatCLP(montoEstimadoMes)}
          sublabel="Total filtrado"
          icon={DollarSign}
        />
        <StatCard
          label="Top proveedor"
          value={topProveedor}
          sublabel="Por monto"
          icon={Award}
        />
      </div>

      {/* Filtros avanzados */}
      <PedidosFiltros
        filters={filters}
        onChange={setFilters}
        proveedores={proveedores}
        sucursales={branches}
      />

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
                {p.items?.length || 0} productos
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
                    handleStatusChange(
                      p.id,
                      e.target.value as EstadoPedido
                    );
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
        data={filteredPedidos}
        keyExtractor={(p) => p.id}
        onRowClick={(p) => setSelectedPedido(p)}
        emptyMessage={
          loadingPedidos ? "Cargando pedidos..." : "No hay pedidos"
        }
      />

      {/* Modal: Create / Edit pedido */}
      <NuevoPedidoModal
        open={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        pedido={editingPedido || undefined}
        proveedores={proveedores}
        productos={productos}
        sucursales={branches}
        onSave={handleSave}
        onCreateProveedor={handleCreateProveedor}
      />

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
              className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text)] font-mono"
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
