"use client";

import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Building2,
  Search,
  Edit2,
  Save,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/ui/DataTable";
import { trabajadoresMock, sucursales } from "@/lib/mock-data";
import { formatDate, formatCLP, getInitials } from "@/lib/utils";
import type { Trabajador, RolTrabajador } from "@/lib/types";

const ROL_LABELS: Record<RolTrabajador, string> = {
  vendedor: "Vendedor", bodeguero: "Bodeguero", cajero: "Cajero",
  jefe_sucursal: "Jefe Sucursal", administrador: "Administrador", auxiliar: "Auxiliar",
};
const ROLES: RolTrabajador[] = ["vendedor", "bodeguero", "cajero", "jefe_sucursal", "administrador", "auxiliar"];

export default function PersonalPage() {
  const [workers, setWorkers] = useState<Trabajador[]>(trabajadoresMock);
  const [search, setSearch] = useState("");
  const [filterSucursal, setFilterSucursal] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [showNewWorker, setShowNewWorker] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Trabajador | null>(null);

  const [newWorker, setNewWorker] = useState({ nombre: "", rut: "", rol: "vendedor" as RolTrabajador, sucursal_id: sucursales[0].id, sueldo_base: 0, email: "", telefono: "" });
  const [editForm, setEditForm] = useState({ nombre: "", rut: "", rol: "vendedor" as RolTrabajador, sucursal_id: "", sueldo_base: 0, email: "", telefono: "" });

  const filtered = useMemo(() => {
    return workers.filter((w) => {
      const matchSearch = search === "" || w.nombre.toLowerCase().includes(search.toLowerCase()) || w.rut.includes(search);
      const matchSucursal = filterSucursal === "all" || w.sucursal_id === filterSucursal;
      const matchEstado = filterEstado === "all" || w.estado === filterEstado;
      return matchSearch && matchSucursal && matchEstado;
    });
  }, [workers, search, filterSucursal, filterEstado]);

  const activos = workers.filter((w) => w.estado === "activo").length;
  const porSucursal = sucursales.map((s) => ({ ...s, count: workers.filter((w) => w.sucursal_id === s.id && w.estado === "activo").length }));

  const handleAddWorker = () => {
    const suc = sucursales.find((s) => s.id === newWorker.sucursal_id);
    const worker: Trabajador = { id: `t${Date.now()}`, nombre: newWorker.nombre, rut: newWorker.rut, rol: newWorker.rol, sucursal_id: newWorker.sucursal_id, sucursal: suc, fecha_ingreso: new Date().toISOString().split("T")[0], estado: "activo", sueldo_base: newWorker.sueldo_base, email: newWorker.email, telefono: newWorker.telefono };
    setWorkers([worker, ...workers]);
    setShowNewWorker(false);
    setNewWorker({ nombre: "", rut: "", rol: "vendedor", sucursal_id: sucursales[0].id, sueldo_base: 0, email: "", telefono: "" });
  };

  const startEdit = (w: Trabajador) => {
    setEditingWorker(w);
    setEditForm({ nombre: w.nombre, rut: w.rut, rol: w.rol, sucursal_id: w.sucursal_id, sueldo_base: w.sueldo_base, email: w.email, telefono: w.telefono });
  };

  const saveEdit = () => {
    if (!editingWorker) return;
    setWorkers(workers.map((w) =>
      w.id === editingWorker.id ? { ...w, ...editForm, sucursal: sucursales.find((s) => s.id === editForm.sucursal_id) } : w
    ));
    setEditingWorker(null);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Personal" subtitle="Gestion de trabajadores por sucursal" icon={Users} action={<Button icon={UserPlus} onClick={() => setShowNewWorker(true)}>Agregar trabajador</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total trabajadores" value={workers.length.toString()} sublabel={`${activos} activos`} icon={Users} />
        {porSucursal.map((s) => (<StatCard key={s.id} label={s.nombre} value={s.count.toString()} sublabel="activos" icon={Building2} />))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o RUT..." className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none" />
        </div>
        <select value={filterSucursal} onChange={(e) => setFilterSucursal(e.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
          <option value="all">Todas las sucursales</option>
          {sucursales.map((s) => (<option key={s.id} value={s.id}>{s.nombre}</option>))}
        </select>
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
          <option value="all">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      <DataTable
        columns={[
          { key: "nombre", header: "Trabajador", render: (w: Trabajador) => (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-xs font-bold text-[var(--color-accent)]">{getInitials(w.nombre)}</div>
              <div><p className="text-sm font-medium text-[var(--color-text)]">{w.nombre}</p><p className="text-xs text-[var(--color-muted)]">{w.email}</p></div>
            </div>
          )},
          { key: "rut", header: "RUT", render: (w: Trabajador) => <span className="text-sm text-[var(--color-text-secondary)]">{w.rut}</span> },
          { key: "rol", header: "Rol", render: (w: Trabajador) => <Badge variant="accent">{ROL_LABELS[w.rol]}</Badge> },
          { key: "sucursal", header: "Sucursal", render: (w: Trabajador) => <span className="text-sm text-[var(--color-text-secondary)]">{sucursales.find((s) => s.id === w.sucursal_id)?.nombre || "—"}</span> },
          { key: "sueldo", header: "Sueldo", render: (w: Trabajador) => <span className="text-sm font-semibold text-[var(--color-text)]">{formatCLP(w.sueldo_base)}</span> },
          { key: "ingreso", header: "Ingreso", render: (w: Trabajador) => <span className="text-xs text-[var(--color-muted)]">{formatDate(w.fecha_ingreso)}</span> },
          { key: "estado", header: "Estado", render: (w: Trabajador) => <Badge variant={w.estado === "activo" ? "success" : "danger"}>{w.estado}</Badge> },
          { key: "editar", header: "", render: (w: Trabajador) => (
            <button onClick={(e) => { e.stopPropagation(); startEdit(w); }} className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)]"><Edit2 className="h-4 w-4" /></button>
          )},
        ]}
        data={filtered}
        keyExtractor={(w) => w.id}
        emptyMessage="No se encontraron trabajadores"
      />

      {/* Modal editar */}
      <Modal open={!!editingWorker} onClose={() => setEditingWorker(null)} title={`Editar — ${editingWorker?.nombre || ""}`} size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Nombre</label>
              <input type="text" value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">RUT</label>
              <input type="text" value={editForm.rut} onChange={(e) => setEditForm({ ...editForm, rut: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Rol</label>
              <select value={editForm.rol} onChange={(e) => setEditForm({ ...editForm, rol: e.target.value as RolTrabajador })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
                {ROLES.map((r) => (<option key={r} value={r}>{ROL_LABELS[r]}</option>))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Sucursal</label>
              <select value={editForm.sucursal_id} onChange={(e) => setEditForm({ ...editForm, sucursal_id: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
                {sucursales.map((s) => (<option key={s.id} value={s.id}>{s.nombre}</option>))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Sueldo base</label>
              <input type="number" value={editForm.sueldo_base} onChange={(e) => setEditForm({ ...editForm, sueldo_base: parseInt(e.target.value) || 0 })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Email</label>
              <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Telefono</label>
              <input type="text" value={editForm.telefono} onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setEditingWorker(null)}>Cancelar</Button>
            <Button icon={Save} onClick={saveEdit}>Guardar cambios</Button>
          </div>
        </div>
      </Modal>

      {/* Modal agregar */}
      <Modal open={showNewWorker} onClose={() => setShowNewWorker(false)} title="Agregar trabajador" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Nombre</label><input type="text" value={newWorker.nombre} onChange={(e) => setNewWorker({ ...newWorker, nombre: e.target.value })} placeholder="Nombre completo" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" /></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">RUT</label><input type="text" value={newWorker.rut} onChange={(e) => setNewWorker({ ...newWorker, rut: e.target.value })} placeholder="12.345.678-9" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" /></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Rol</label><select value={newWorker.rol} onChange={(e) => setNewWorker({ ...newWorker, rol: e.target.value as RolTrabajador })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">{ROLES.map((r) => (<option key={r} value={r}>{ROL_LABELS[r]}</option>))}</select></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Sucursal</label><select value={newWorker.sucursal_id} onChange={(e) => setNewWorker({ ...newWorker, sucursal_id: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">{sucursales.map((s) => (<option key={s.id} value={s.id}>{s.nombre}</option>))}</select></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Sueldo base</label><input type="number" value={newWorker.sueldo_base} onChange={(e) => setNewWorker({ ...newWorker, sueldo_base: parseInt(e.target.value) || 0 })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" /></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Email</label><input type="email" value={newWorker.email} onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowNewWorker(false)}>Cancelar</Button>
            <Button onClick={handleAddWorker} disabled={!newWorker.nombre || !newWorker.rut}>Agregar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
