"use client";

import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Wallet,
  AlertCircle,
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useThemeStore } from "@/store/theme-store";
import { pedidosMock, sucursales } from "@/lib/mock-data";
import { formatCLP, formatDateShort, percentage } from "@/lib/utils";

const GASTOS_CATEGORIAS = [
  { nombre: "Remuneraciones", valor: 4590000, color: "#f4a7bb" },
  { nombre: "Pedidos", valor: 2200000, color: "#98d4bb" },
  { nombre: "Gastos admin.", valor: 1200000, color: "#c3a6d8" },
  { nombre: "Otros", valor: 510000, color: "#8ec5e8" },
];

const MONTHLY_GASTOS = [
  { mes: "Oct", remuneraciones: 4200000, pedidos: 1900000, admin: 800000 },
  { mes: "Nov", remuneraciones: 4350000, pedidos: 2100000, admin: 950000 },
  { mes: "Dic", remuneraciones: 4500000, pedidos: 2400000, admin: 1100000 },
  { mes: "Ene", remuneraciones: 4400000, pedidos: 1800000, admin: 900000 },
  { mes: "Feb", remuneraciones: 4550000, pedidos: 2200000, admin: 1050000 },
  { mes: "Mar", remuneraciones: 4590000, pedidos: 2200000, admin: 1200000 },
];

const PEDIDOS_POR_SUCURSAL = sucursales.map((s, i) => ({
  nombre: s.nombre.replace("Sucursal ", ""),
  pedidos: [8, 5, 3][i] || 0,
}));

interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "pedido" | "pago" | "tarea";
  urgent: boolean;
}

const notifications: Notification[] = [
  { id: "n1", title: "Pedido pendiente", description: "Cementos del Sur — entrega manana", date: "2026-03-02", type: "pedido", urgent: true },
  { id: "n2", title: "Quincena proxima", description: "Pago quincena 7 trabajadores — 15 Mar", date: "2026-03-15", type: "pago", urgent: false },
  { id: "n3", title: "Tarea atrasada", description: "Actualizar catalogo de productos", date: "2026-02-28", type: "tarea", urgent: true },
  { id: "n4", title: "Pago arriendo", description: "Sucursal Norte — vence el 5 Mar", date: "2026-03-05", type: "pago", urgent: false },
  { id: "n5", title: "Pre-pedido guardado", description: "Maderas Nativas — borrador sin enviar", date: "2026-02-28", type: "pedido", urgent: false },
];

const NOTIF_ICONS = { pedido: ShoppingCart, pago: Wallet, tarea: Clock };

export default function DashboardPage() {
  const budget = useThemeStore((s) => s.budget);
  const totalGasto = GASTOS_CATEGORIAS.reduce((s, c) => s + c.valor, 0);
  const disponible = budget - totalGasto;
  const pctUsado = percentage(totalGasto, budget);

  const donutData = [
    ...GASTOS_CATEGORIAS,
    { nombre: "Disponible", valor: Math.max(disponible, 0), color: "#2e3150" },
  ];

  const borradores = pedidosMock.filter((p) => p.estado === "borrador");

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        subtitle="Vista general — Marzo 2026"
        icon={TrendingUp}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Presupuesto mes" value={formatCLP(budget)} sublabel="Configurado en ajustes" icon={DollarSign} />
        <StatCard label="Gasto acumulado" value={formatCLP(totalGasto)} sublabel={`${pctUsado}% utilizado`} icon={TrendingUp} trend={{ value: "12%", positive: false }} />
        <StatCard label="Disponible" value={formatCLP(Math.max(disponible, 0))} sublabel={`${100 - pctUsado}% restante`} icon={Wallet} />
        <StatCard label="Pedidos del mes" value={pedidosMock.length.toString()} sublabel={`${borradores.length} borradores`} icon={ShoppingCart} />
      </div>

      {/* Donut + Area chart */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Presupuesto mensual</h3>
          <div className="flex flex-col items-center">
            <div className="relative">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} dataKey="valor" stroke="none" paddingAngle={2}>
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCLP(value as number)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--color-text)]">{pctUsado}%</span>
                <span className="text-xs text-[var(--color-muted)]">usado</span>
              </div>
            </div>
            <div className="mt-4 w-full space-y-2">
              {GASTOS_CATEGORIAS.map((cat) => (
                <div key={cat.nombre} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-[var(--color-text-secondary)]">{cat.nombre}</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-text)]">{formatCLP(cat.valor)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Gastos mensuales</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MONTHLY_GASTOS}>
              <defs>
                <linearGradient id="gRem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f4a7bb" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f4a7bb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#98d4bb" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#98d4bb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAdm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c3a6d8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c3a6d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mes" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatCLP(value as number)} />
              <Area type="monotone" dataKey="remuneraciones" name="Remuneraciones" stroke="#f4a7bb" fill="url(#gRem)" strokeWidth={2} />
              <Area type="monotone" dataKey="pedidos" name="Pedidos" stroke="#98d4bb" fill="url(#gPed)" strokeWidth={2} />
              <Area type="monotone" dataKey="admin" name="Admin." stroke="#c3a6d8" fill="url(#gAdm)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bar chart + Notifications */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Pedidos por sucursal</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PEDIDOS_POR_SUCURSAL} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="nombre" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} />
              <Tooltip />
              <Bar dataKey="pedidos" name="Pedidos" fill="#98d4bb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Notificaciones</h3>
          <div className="space-y-2 max-h-[260px] overflow-y-auto">
            {notifications.map((notif) => {
              const Icon = NOTIF_ICONS[notif.type];
              return (
                <div key={notif.id} className="flex items-start gap-3 rounded-xl bg-[var(--color-surface-alt)] p-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10">
                    <Icon className="h-4 w-4 text-[var(--color-accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-[var(--color-text)] truncate">{notif.title}</p>
                      {notif.urgent && <AlertCircle className="h-3 w-3 flex-shrink-0 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-[var(--color-muted)] mt-0.5 truncate">{notif.description}</p>
                    <p className="text-[10px] text-[var(--color-muted)] mt-1">{formatDateShort(notif.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Pre-pedidos */}
      {borradores.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--color-accent)]" />
              Pre-pedidos (borradores)
            </h3>
            <a href="/pedidos" className="flex items-center gap-1 text-xs font-medium text-[var(--color-accent)] hover:underline">
              Ver todos <ChevronRight className="h-3 w-3" />
            </a>
          </div>
          <div className="space-y-2">
            {borradores.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-[var(--color-surface-alt)] p-3">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4 text-[var(--color-muted)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">{p.proveedor?.nombre}</p>
                    <p className="text-xs text-[var(--color-muted)]">{p.items.length} items — {p.sucursal?.nombre}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{formatCLP(p.total_estimado)}</p>
                  <Badge variant="warning">borrador</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
