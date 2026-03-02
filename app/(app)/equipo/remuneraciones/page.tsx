"use client";

import { useState, useMemo } from "react";
import {
  Wallet,
  Users,
  DollarSign,
  CalendarDays,
  Plus,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { useThemeStore } from "@/store/theme-store";
import { trabajadoresMock, pagosMock, sucursales } from "@/lib/mock-data";
import { formatCLP, formatDate, percentage } from "@/lib/utils";
import type { Pago, TipoPago } from "@/lib/types";

const TIPO_LABELS: Record<TipoPago, string> = { quincena: "Quincena", sueldo: "Sueldo", bono: "Bono", descuento: "Descuento" };
const TIPO_BADGE: Record<TipoPago, "accent" | "success" | "info" | "danger"> = { quincena: "accent", sueldo: "success", bono: "info", descuento: "danger" };

const MONTHLY_REM = [
  { mes: "Oct", total: 4200000 },
  { mes: "Nov", total: 4350000 },
  { mes: "Dic", total: 4500000 },
  { mes: "Ene", total: 4400000 },
  { mes: "Feb", total: 4550000 },
  { mes: "Mar", total: 4590000 },
];

const REM_POR_SUCURSAL = sucursales.map((s, i) => ({
  nombre: s.nombre.replace("Sucursal ", ""),
  total: [2200000, 1500000, 890000][i] || 0,
  color: ["#f4a7bb", "#98d4bb", "#c3a6d8"][i],
}));

export default function RemuneracionesPage() {
  const [pagos, setPagos] = useState<Pago[]>(pagosMock);
  const [showNewPago, setShowNewPago] = useState(false);
  const [filterMes, setFilterMes] = useState("all");
  const [filterSucursal, setFilterSucursal] = useState("all");
  const [copiedForms, setCopiedForms] = useState(false);
  const budget = useThemeStore((s) => s.budget);

  const [newPago, setNewPago] = useState({ trabajador_id: trabajadoresMock[0].id, tipo: "quincena" as TipoPago, monto: 0, fecha_pago: new Date().toISOString().split("T")[0], periodo: "2026-03" });

  const activos = trabajadoresMock.filter((t) => t.estado === "activo");
  const totalSueldos = activos.reduce((s, t) => s + t.sueldo_base, 0);
  const totalPagos = pagos.reduce((s, p) => s + p.monto, 0);
  const pctPresupuesto = percentage(totalSueldos, budget);

  const handleAddPago = () => {
    const pago: Pago = { id: `pay${Date.now()}`, ...newPago };
    setPagos([pago, ...pagos]);
    setShowNewPago(false);
  };

  // Google Forms template
  const generateFormsTemplate = () => {
    const lines = [
      "=== PLANTILLA FORMULARIO REMUNERACIONES MAAK ===",
      "",
      "Titulo: Registro de Remuneraciones — MAAK",
      "",
      "Campos sugeridos:",
      "1. Nombre del trabajador (Desplegable): " + activos.map((t) => t.nombre).join(", "),
      "2. RUT (Texto corto)",
      "3. Tipo de pago (Desplegable): Sueldo, Quincena, Bono, Comision, Descuento",
      "4. Monto (Numero)",
      "5. Periodo (Texto corto) — Formato: YYYY-MM",
      "6. Fecha de pago (Fecha)",
      "7. Sucursal (Desplegable): " + sucursales.map((s) => s.nombre).join(", "),
      "8. Observaciones (Parrafo)",
      "",
      "Para crear en Google Forms:",
      "1. Ve a forms.google.com",
      "2. Crea un nuevo formulario",
      "3. Agrega los campos listados arriba",
      "4. Comparte el enlace con tu equipo de RRHH",
    ];
    return lines.join("\n");
  };

  const handleCopyForms = () => {
    navigator.clipboard.writeText(generateFormsTemplate());
    setCopiedForms(true);
    setTimeout(() => setCopiedForms(false), 2000);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Remuneraciones" subtitle="Sueldos, pagos y reportes" icon={Wallet} action={
        <div className="flex gap-2">
          <Button variant="secondary" icon={copiedForms ? Check : FileText} onClick={handleCopyForms}>{copiedForms ? "Copiado" : "Plantilla Google Forms"}</Button>
          <Button icon={Plus} onClick={() => setShowNewPago(true)}>Nuevo pago</Button>
        </div>
      } />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total sueldos mes" value={formatCLP(totalSueldos)} sublabel="Marzo 2026" icon={DollarSign} />
        <StatCard label="Trabajadores activos" value={activos.length.toString()} sublabel="En 3 sucursales" icon={Users} />
        <StatCard label="% del presupuesto" value={`${pctPresupuesto}%`} sublabel={`de ${formatCLP(budget)}`} icon={Wallet} />
        <StatCard label="Proxima quincena" value={formatCLP(Math.round(totalSueldos / 2))} sublabel="15 Mar" icon={CalendarDays} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Remuneraciones mensuales</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_REM}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mes" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatCLP(value as number)} />
              <Bar dataKey="total" name="Remuneraciones" fill="#f4a7bb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Por sucursal</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={REM_POR_SUCURSAL} cx="50%" cy="50%" outerRadius={80} dataKey="total" nameKey="nombre" stroke="none" paddingAngle={3} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {REM_POR_SUCURSAL.map((entry, i) => (<Cell key={i} fill={entry.color!} />))}
              </Pie>
              <Tooltip formatter={(value) => formatCLP(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={filterMes} onChange={(e) => setFilterMes(e.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
          <option value="all">Todos los meses</option>
          <option value="2026-03">Marzo 2026</option>
          <option value="2026-02">Febrero 2026</option>
          <option value="2026-01">Enero 2026</option>
        </select>
        <select value={filterSucursal} onChange={(e) => setFilterSucursal(e.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
          <option value="all">Todas las sucursales</option>
          {sucursales.map((s) => (<option key={s.id} value={s.id}>{s.nombre}</option>))}
        </select>
      </div>

      {/* Tabla pagos */}
      <DataTable
        columns={[
          { key: "trabajador", header: "Trabajador", render: (p: Pago) => {
            const t = trabajadoresMock.find((t) => t.id === p.trabajador_id);
            return <span className="text-sm font-medium text-[var(--color-text)]">{t?.nombre || "—"}</span>;
          }},
          { key: "tipo", header: "Tipo", render: (p: Pago) => <Badge variant={TIPO_BADGE[p.tipo]}>{TIPO_LABELS[p.tipo]}</Badge> },
          { key: "monto", header: "Monto", render: (p: Pago) => <span className="text-sm font-semibold text-[var(--color-text)]">{formatCLP(p.monto)}</span> },
          { key: "fecha", header: "Fecha", render: (p: Pago) => <span className="text-sm text-[var(--color-text-secondary)]">{formatDate(p.fecha_pago)}</span> },
          { key: "periodo", header: "Periodo", render: (p: Pago) => <span className="text-xs text-[var(--color-muted)]">{p.periodo}</span> },
        ]}
        data={pagos}
        keyExtractor={(p) => p.id}
      />

      {/* Modal nuevo pago */}
      <Modal open={showNewPago} onClose={() => setShowNewPago(false)} title="Nuevo pago">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Trabajador</label>
              <select value={newPago.trabajador_id} onChange={(e) => setNewPago({ ...newPago, trabajador_id: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
                {activos.map((t) => (<option key={t.id} value={t.id}>{t.nombre}</option>))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Tipo</label>
              <select value={newPago.tipo} onChange={(e) => setNewPago({ ...newPago, tipo: e.target.value as TipoPago })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
                <option value="quincena">Quincena</option>
                <option value="sueldo">Sueldo</option>
                <option value="bono">Bono</option>
                <option value="descuento">Descuento</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Monto</label>
              <input type="number" value={newPago.monto} onChange={(e) => setNewPago({ ...newPago, monto: parseInt(e.target.value) || 0 })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Fecha pago</label>
              <input type="date" value={newPago.fecha_pago} onChange={(e) => setNewPago({ ...newPago, fecha_pago: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowNewPago(false)}>Cancelar</Button>
            <Button onClick={handleAddPago} disabled={!newPago.monto}>Agregar pago</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
