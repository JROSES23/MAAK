"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Building2,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { useBranchesStore } from "@/store/useBranchesStore";
import { createClient } from "@/lib/supabase/client";
import { formatCLP } from "@/lib/utils";

interface PedidoRow {
  id: string;
  fecha: string;
  total_estimado: number;
  sucursal_id: string;
  sucursales: { id: string; nombre: string; color: string } | null;
  proveedores: { id: string; nombre: string } | null;
  pedido_items: {
    cantidad: number;
    producto_id: string;
    productos: { nombre: string; categoria: string } | null;
  }[];
}

interface BranchSummary {
  id: string;
  nombre: string;
  color: string;
  totalPedidos: number;
  montoTotal: number;
  productosUnicos: number;
  topProductos: { nombre: string; cantidad: number }[];
  proveedorFrecuente: string;
}

export default function PedidosPorSucursalPage() {
  const branches = useBranchesStore((s) => s.branches);
  const [pedidos, setPedidos] = useState<PedidoRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterSucursal, setFilterSucursal] = useState("all");
  const [filterProveedor, setFilterProveedor] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      let query = supabase
        .from("pedidos")
        .select(`
          id, fecha, total_estimado, sucursal_id,
          sucursales(id, nombre, color),
          proveedores(id, nombre),
          pedido_items(cantidad, producto_id, productos(nombre, categoria))
        `);

      if (fechaDesde) query = query.gte("fecha", fechaDesde);
      if (fechaHasta) query = query.lte("fecha", fechaHasta);

      const { data, error } = await query;
      if (!error && data) {
        setPedidos(data as unknown as PedidoRow[]);
      }
      setLoading(false);
    };
    load();
  }, [fechaDesde, fechaHasta]);

  // Compute summaries per branch
  const summaries = useMemo(() => {
    const filteredData =
      filterSucursal === "all"
        ? pedidos
        : pedidos.filter((p) => p.sucursal_id === filterSucursal);

    const filteredByProv = filterProveedor
      ? filteredData.filter((p) =>
          p.proveedores?.nombre
            ?.toLowerCase()
            .includes(filterProveedor.toLowerCase())
        )
      : filteredData;

    const branchMap = new Map<string, BranchSummary>();

    branches.forEach((branch) => {
      branchMap.set(branch.id, {
        id: branch.id,
        nombre: branch.nombre,
        color: branch.color || "#f4a7bb",
        totalPedidos: 0,
        montoTotal: 0,
        productosUnicos: 0,
        topProductos: [],
        proveedorFrecuente: "—",
      });
    });

    // Product counts per branch
    const branchProducts: Record<string, Record<string, number>> = {};
    const branchProviders: Record<string, Record<string, number>> = {};

    filteredByProv.forEach((p) => {
      const b = branchMap.get(p.sucursal_id);
      if (!b) return;
      b.totalPedidos++;
      b.montoTotal += p.total_estimado;

      if (!branchProducts[p.sucursal_id]) branchProducts[p.sucursal_id] = {};
      if (!branchProviders[p.sucursal_id]) branchProviders[p.sucursal_id] = {};

      const provName = p.proveedores?.nombre || "Desconocido";
      branchProviders[p.sucursal_id][provName] =
        (branchProviders[p.sucursal_id][provName] || 0) + 1;

      p.pedido_items.forEach((item) => {
        const prodName = item.productos?.nombre || "—";
        branchProducts[p.sucursal_id][prodName] =
          (branchProducts[p.sucursal_id][prodName] || 0) + item.cantidad;
      });
    });

    // Fill summaries
    branchMap.forEach((summary, branchId) => {
      const products = branchProducts[branchId] || {};
      const providers = branchProviders[branchId] || {};

      summary.productosUnicos = Object.keys(products).length;
      summary.topProductos = Object.entries(products)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }));

      const topProv = Object.entries(providers).sort((a, b) => b[1] - a[1]);
      summary.proveedorFrecuente = topProv[0]?.[0] || "—";
    });

    return Array.from(branchMap.values()).filter(
      (s) => filterSucursal === "all" || s.id === filterSucursal
    );
  }, [pedidos, branches, filterSucursal, filterProveedor]);

  // Chart data
  const chartData = summaries.map((s) => ({
    nombre: s.nombre,
    total: s.montoTotal,
    color: s.color,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pedidos por sucursal"
        subtitle="Analisis comparativo de pedidos entre sucursales"
        icon={Building2}
      />

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filterSucursal}
          onChange={(e) => setFilterSucursal(e.target.value)}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
        >
          <option value="all">Todas las sucursales</option>
          {branches.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
          placeholder="Desde"
        />
        <input
          type="date"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
          placeholder="Hasta"
        />
        <input
          type="text"
          value={filterProveedor}
          onChange={(e) => setFilterProveedor(e.target.value)}
          placeholder="Filtrar proveedor..."
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none"
        />
      </div>

      {/* Cards resumen por sucursal */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaries.map((s) => (
          <Card key={s.id}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  {s.nombre}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-lg font-bold text-[var(--color-text)]">
                    {s.totalPedidos}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    Total pedidos
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text)]">
                    {formatCLP(s.montoTotal)}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    Monto total
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--color-muted)] mb-1">
                  Top 3 productos
                </p>
                {s.topProductos.length > 0 ? (
                  <div className="space-y-0.5">
                    {s.topProductos.map((tp, i) => (
                      <p
                        key={i}
                        className="text-xs text-[var(--color-text-secondary)]"
                      >
                        {tp.nombre} ({tp.cantidad})
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-muted)]">
                    Sin datos
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-[var(--color-muted)]">
                  Proveedor frecuente:{" "}
                  <span className="text-[var(--color-text)]">
                    {s.proveedorFrecuente}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabla comparativa */}
      <DataTable
        columns={[
          {
            key: "sucursal",
            header: "Sucursal",
            render: (s: BranchSummary) => (
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {s.nombre}
                </span>
              </div>
            ),
          },
          {
            key: "totalPedidos",
            header: "Total pedidos",
            render: (s: BranchSummary) => (
              <span className="text-sm text-[var(--color-text)]">
                {s.totalPedidos}
              </span>
            ),
          },
          {
            key: "montoTotal",
            header: "Monto total",
            render: (s: BranchSummary) => (
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {formatCLP(s.montoTotal)}
              </span>
            ),
          },
          {
            key: "topProducto",
            header: "Producto mas pedido",
            render: (s: BranchSummary) => (
              <span className="text-sm text-[var(--color-text-secondary)]">
                {s.topProductos[0]?.nombre || "—"}
              </span>
            ),
          },
          {
            key: "proveedorFrecuente",
            header: "Proveedor frecuente",
            render: (s: BranchSummary) => (
              <span className="text-sm text-[var(--color-text-secondary)]">
                {s.proveedorFrecuente}
              </span>
            ),
          },
        ]}
        data={summaries}
        keyExtractor={(s) => s.id}
        emptyMessage={loading ? "Cargando datos..." : "Sin datos"}
      />

      {/* Grafico de barras */}
      {chartData.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">
            Monto total por sucursal
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="nombre"
                tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value) => formatCLP(value as number)}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color || "#f4a7bb"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
