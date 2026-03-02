"use client";

import { useState, useMemo } from "react";
import {
  Receipt,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  PiggyBank,
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
} from "recharts";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { useThemeStore } from "@/store/theme-store";
import { formatCLP, formatDate } from "@/lib/utils";

const CATEGORIAS = ["Arriendo", "Luz", "Agua", "Internet", "Gas", "Transporte", "Alimentacion", "Otro"];
const CAT_COLORS: Record<string, string> = {
  Arriendo: "#f4a7bb",
  Luz: "#f0d789",
  Agua: "#8ec5e8",
  Internet: "#c3a6d8",
  Gas: "#f7c59f",
  Transporte: "#98d4bb",
  Alimentacion: "#f08a7e",
  Otro: "#b0aeab",
};

interface GastoPersonal {
  id: string;
  fecha: string;
  monto: number;
  categoria: string;
  descripcion: string;
  incluirEnPresupuesto: boolean;
}

const gastosMock: GastoPersonal[] = [
  { id: "g1", fecha: "2026-03-01", monto: 450000, categoria: "Arriendo", descripcion: "Arriendo departamento", incluirEnPresupuesto: true },
  { id: "g2", fecha: "2026-03-02", monto: 45000, categoria: "Luz", descripcion: "Cuenta luz marzo", incluirEnPresupuesto: true },
  { id: "g3", fecha: "2026-03-02", monto: 22000, categoria: "Agua", descripcion: "Cuenta agua marzo", incluirEnPresupuesto: true },
  { id: "g4", fecha: "2026-03-01", monto: 30000, categoria: "Internet", descripcion: "Fibra optica", incluirEnPresupuesto: true },
  { id: "g5", fecha: "2026-03-01", monto: 15000, categoria: "Gas", descripcion: "Gas cilindro 15kg", incluirEnPresupuesto: false },
  { id: "g6", fecha: "2026-02-28", monto: 8000, categoria: "Transporte", descripcion: "Uber viaje proveedores", incluirEnPresupuesto: false },
];

export default function GastosPersonalesPage() {
  const [gastos, setGastos] = useState<GastoPersonal[]>(gastosMock);
  const [showNewGasto, setShowNewGasto] = useState(false);
  const budget = useThemeStore((s) => s.budget);

  const [newGasto, setNewGasto] = useState({
    fecha: new Date().toISOString().split("T")[0],
    monto: 0,
    categoria: "Arriendo",
    descripcion: "",
    incluirEnPresupuesto: true,
  });

  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0);
  const gastosEnPresupuesto = gastos.filter((g) => g.incluirEnPresupuesto).reduce((s, g) => s + g.monto, 0);
  const gastosInformales = totalGastos - gastosEnPresupuesto;

  // Data para graficos
  const porCategoria = useMemo(() => {
    const map: Record<string, number> = {};
    gastos.forEach((g) => { map[g.categoria] = (map[g.categoria] || 0) + g.monto; });
    return Object.entries(map).map(([nombre, valor]) => ({ nombre, valor, color: CAT_COLORS[nombre] || "#b0aeab" }));
  }, [gastos]);

  const handleAddGasto = () => {
    const gasto: GastoPersonal = {
      id: `g${Date.now()}`,
      ...newGasto,
    };
    setGastos([gasto, ...gastos]);
    setShowNewGasto(false);
    setNewGasto({ fecha: new Date().toISOString().split("T")[0], monto: 0, categoria: "Arriendo", descripcion: "", incluirEnPresupuesto: true });
  };

  const togglePresupuesto = (id: string) => {
    setGastos(gastos.map((g) => g.id === id ? { ...g, incluirEnPresupuesto: !g.incluirEnPresupuesto } : g));
  };

  const deleteGasto = (id: string) => {
    setGastos(gastos.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Gastos personales" subtitle="Registra y clasifica tus gastos" icon={Receipt} action={<Button icon={Plus} onClick={() => setShowNewGasto(true)}>Nuevo gasto</Button>} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total gastos" value={formatCLP(totalGastos)} sublabel="Todos los gastos" icon={DollarSign} />
        <StatCard label="En presupuesto" value={formatCLP(gastosEnPresupuesto)} sublabel="Afectan el presupuesto" icon={TrendingUp} />
        <StatCard label="Informales" value={formatCLP(gastosInformales)} sublabel="No afectan presupuesto" icon={PiggyBank} />
        <StatCard label="Presupuesto mensual" value={formatCLP(budget)} sublabel="Configurado" icon={DollarSign} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Por categoria</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={porCategoria} cx="50%" cy="50%" outerRadius={90} dataKey="valor" nameKey="nombre" stroke="none" paddingAngle={2} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {porCategoria.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip formatter={(value) => formatCLP(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Montos por categoria</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={porCategoria} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="nombre" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} />
              <Tooltip formatter={(value) => formatCLP(value as number)} />
              <Bar dataKey="valor" name="Monto" radius={[0, 6, 6, 0]}>
                {porCategoria.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tabla de gastos */}
      <DataTable
        columns={[
          { key: "fecha", header: "Fecha", render: (g: GastoPersonal) => <span className="text-sm text-[var(--color-text)]">{formatDate(g.fecha)}</span> },
          { key: "categoria", header: "Categoria", render: (g: GastoPersonal) => (
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CAT_COLORS[g.categoria] || "#b0aeab" }} />
              <span className="text-sm text-[var(--color-text)]">{g.categoria}</span>
            </div>
          )},
          { key: "descripcion", header: "Descripcion", render: (g: GastoPersonal) => <span className="text-sm text-[var(--color-text-secondary)]">{g.descripcion}</span> },
          { key: "monto", header: "Monto", render: (g: GastoPersonal) => <span className="text-sm font-semibold text-[var(--color-text)]">{formatCLP(g.monto)}</span> },
          { key: "presupuesto", header: "En presupuesto", render: (g: GastoPersonal) => (
            <button onClick={(e) => { e.stopPropagation(); togglePresupuesto(g.id); }} className="cursor-pointer">
              <Badge variant={g.incluirEnPresupuesto ? "success" : "default"}>{g.incluirEnPresupuesto ? "Si" : "No"}</Badge>
            </button>
          )},
          { key: "acciones", header: "", render: (g: GastoPersonal) => (
            <button onClick={(e) => { e.stopPropagation(); deleteGasto(g.id); }} className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          )},
        ]}
        data={gastos}
        keyExtractor={(g) => g.id}
      />

      {/* Modal nuevo gasto */}
      <Modal open={showNewGasto} onClose={() => setShowNewGasto(false)} title="Nuevo gasto personal">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Fecha</label>
              <input type="date" value={newGasto.fecha} onChange={(e) => setNewGasto({ ...newGasto, fecha: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Monto</label>
              <input type="number" value={newGasto.monto} onChange={(e) => setNewGasto({ ...newGasto, monto: parseInt(e.target.value) || 0 })} placeholder="50000" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Categoria</label>
              <select value={newGasto.categoria} onChange={(e) => setNewGasto({ ...newGasto, categoria: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
                {CATEGORIAS.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Incluir en presupuesto</label>
              <select value={newGasto.incluirEnPresupuesto ? "si" : "no"} onChange={(e) => setNewGasto({ ...newGasto, incluirEnPresupuesto: e.target.value === "si" })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
                <option value="si">Si — afecta presupuesto</option>
                <option value="no">No — gasto informal</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Descripcion</label>
            <input type="text" value={newGasto.descripcion} onChange={(e) => setNewGasto({ ...newGasto, descripcion: e.target.value })} placeholder="Breve descripcion del gasto" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowNewGasto(false)}>Cancelar</Button>
            <Button onClick={handleAddGasto} disabled={!newGasto.monto}>Agregar gasto</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
