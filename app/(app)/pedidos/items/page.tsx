"use client";

import { useState, useMemo } from "react";
import {
  ListOrdered,
  Plus,
  Edit2,
  Trash2,
  Save,
  Search,
  Building2,
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
import { productos, proveedores, sucursales, pedidosMock } from "@/lib/mock-data";
import { formatCLP } from "@/lib/utils";
import type { Producto } from "@/lib/types";

// Calcular stats de items a partir de pedidos
function getItemStats() {
  const itemCount: Record<string, { nombre: string; cantidad: number; veces: number; porSucursal: Record<string, number> }> = {};
  pedidosMock.forEach((p) => {
    p.items.forEach((item) => {
      const name = item.producto?.nombre || "Desconocido";
      if (!itemCount[name]) itemCount[name] = { nombre: name, cantidad: 0, veces: 0, porSucursal: {} };
      itemCount[name].cantidad += item.cantidad;
      itemCount[name].veces += 1;
      const suc = item.sucursal?.nombre || p.sucursal?.nombre || "Sin sucursal";
      itemCount[name].porSucursal[suc] = (itemCount[name].porSucursal[suc] || 0) + item.cantidad;
    });
  });
  return Object.values(itemCount).sort((a, b) => b.veces - a.veces);
}

const COLORS = ["#f4a7bb", "#98d4bb", "#c3a6d8", "#8ec5e8", "#f7c59f", "#f0d789"];

export default function ItemsPage() {
  const [items, setItems] = useState<Producto[]>(productos);
  const [search, setSearch] = useState("");
  const [showNewItem, setShowNewItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Producto | null>(null);
  const [selectedSucursal, setSelectedSucursal] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({ nombre: "", unidad_default: "un", categoria: "" });
  const [editForm, setEditForm] = useState({ nombre: "", unidad_default: "", categoria: "" });

  const itemStats = useMemo(() => getItemStats(), []);
  const topItems = itemStats.slice(0, 6);

  const filteredItems = useMemo(() => {
    return items.filter((i) => search === "" || i.nombre.toLowerCase().includes(search.toLowerCase()) || i.categoria.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  // Items por sucursal
  const porSucursal = useMemo(() => {
    const map: Record<string, number> = {};
    pedidosMock.forEach((p) => {
      const suc = p.sucursal?.nombre || "Sin sucursal";
      map[suc] = (map[suc] || 0) + p.items.length;
    });
    return Object.entries(map).map(([nombre, total], i) => ({ nombre: nombre.replace("Sucursal ", ""), total, color: COLORS[i % COLORS.length] }));
  }, []);

  const handleAddItem = () => {
    const item: Producto = { id: `prod${Date.now()}`, ...newItem };
    setItems([item, ...items]);
    setShowNewItem(false);
    setNewItem({ nombre: "", unidad_default: "un", categoria: "" });
  };

  const startEdit = (item: Producto) => {
    setEditingItem(item);
    setEditForm({ nombre: item.nombre, unidad_default: item.unidad_default, categoria: item.categoria });
  };

  const saveEdit = () => {
    if (!editingItem) return;
    setItems(items.map((i) => i.id === editingItem.id ? { ...i, ...editForm } : i));
    setEditingItem(null);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Items" subtitle="Catalogo de productos y estadisticas" icon={ListOrdered} action={<Button icon={Plus} onClick={() => setShowNewItem(true)}>Nuevo item</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total items" value={items.length.toString()} sublabel="En catalogo" icon={ListOrdered} />
        <StatCard label="Mas pedido" value={topItems[0]?.nombre || "—"} sublabel={`${topItems[0]?.veces || 0} veces`} icon={ListOrdered} />
        <StatCard label="Categorias" value={new Set(items.map((i) => i.categoria)).size.toString()} sublabel="Distintas" icon={ListOrdered} />
        <StatCard label="Sucursales activas" value={sucursales.length.toString()} sublabel="Con pedidos" icon={Building2} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Items mas pedidos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topItems} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis type="category" dataKey="nombre" tick={{ fill: "var(--color-muted)", fontSize: 10 }} axisLine={false} width={90} />
              <Tooltip />
              <Bar dataKey="veces" name="Veces pedido" fill="#98d4bb" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Items por sucursal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={porSucursal} cx="50%" cy="50%" outerRadius={90} dataKey="total" nameKey="nombre" stroke="none" paddingAngle={3} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {porSucursal.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar item o categoria..." className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none" />
      </div>

      {/* Items table */}
      <DataTable
        columns={[
          { key: "nombre", header: "Producto", render: (i: Producto) => <span className="text-sm font-medium text-[var(--color-text)]">{i.nombre}</span> },
          { key: "unidad", header: "Unidad", render: (i: Producto) => <Badge variant="default">{i.unidad_default}</Badge> },
          { key: "categoria", header: "Categoria", render: (i: Producto) => <span className="text-sm text-[var(--color-text-secondary)]">{i.categoria}</span> },
          { key: "acciones", header: "", render: (i: Producto) => (
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); startEdit(i); }} className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)]"><Edit2 className="h-4 w-4" /></button>
              <button onClick={(e) => { e.stopPropagation(); deleteItem(i.id); }} className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          )},
        ]}
        data={filteredItems}
        keyExtractor={(i) => i.id}
      />

      {/* Modal nuevo item */}
      <Modal open={showNewItem} onClose={() => setShowNewItem(false)} title="Nuevo item">
        <div className="space-y-4">
          <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Nombre</label><input type="text" value={newItem.nombre} onChange={(e) => setNewItem({ ...newItem, nombre: e.target.value })} placeholder="Nombre del producto" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Unidad</label><input type="text" value={newItem.unidad_default} onChange={(e) => setNewItem({ ...newItem, unidad_default: e.target.value })} placeholder="un, kg, m3..." className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" /></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Categoria</label><input type="text" value={newItem.categoria} onChange={(e) => setNewItem({ ...newItem, categoria: e.target.value })} placeholder="Construccion, Pinturas..." className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowNewItem(false)}>Cancelar</Button>
            <Button onClick={handleAddItem} disabled={!newItem.nombre}>Agregar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal editar */}
      <Modal open={!!editingItem} onClose={() => setEditingItem(null)} title="Editar item">
        <div className="space-y-4">
          <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Nombre</label><input type="text" value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Unidad</label><input type="text" value={editForm.unidad_default} onChange={(e) => setEditForm({ ...editForm, unidad_default: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" /></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-[var(--color-text-secondary)]">Categoria</label><input type="text" value={editForm.categoria} onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setEditingItem(null)}>Cancelar</Button>
            <Button icon={Save} onClick={saveEdit}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
