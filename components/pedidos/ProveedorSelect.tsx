"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Proveedor } from "@/lib/types";

interface ProveedorSelectProps {
  proveedores: Proveedor[];
  value: string;
  onChange: (id: string) => void;
  onCreateNew: (prov: Omit<Proveedor, "id" | "created_at">) => Promise<Proveedor | null>;
}

export function ProveedorSelect({
  proveedores,
  value,
  onChange,
  onCreateNew,
}: ProveedorSelectProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProv, setNewProv] = useState({
    nombre: "",
    rut: "",
    telefono: "",
    email: "",
    direccion: "",
  });
  const [saving, setSaving] = useState(false);

  const filtered = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const selectedName =
    proveedores.find((p) => p.id === value)?.nombre || "Seleccionar proveedor";

  const handleCreate = async () => {
    if (!newProv.nombre.trim()) return;
    setSaving(true);
    const created = await onCreateNew(newProv);
    if (created) {
      onChange(created.id);
      setShowNewForm(false);
      setNewProv({ nombre: "", rut: "", telefono: "", email: "", direccion: "" });
    }
    setSaving(false);
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-left text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
      >
        {selectedName}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
          {/* Search */}
          <div className="relative p-2">
            <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar proveedor..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] py-1.5 pl-8 pr-3 text-xs text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="max-h-40 overflow-y-auto px-1 pb-1">
            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange(p.id);
                  setShowDropdown(false);
                  setSearch("");
                }}
                className="w-full rounded-lg px-3 py-1.5 text-left text-xs text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]"
              >
                <span className="font-medium">{p.nombre}</span>
                <span className="ml-2 text-[var(--color-muted)]">{p.rut}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-[var(--color-muted)]">
                Sin resultados
              </p>
            )}
          </div>

          {/* New provider inline */}
          <div className="border-t border-[var(--color-border)] p-2">
            {!showNewForm ? (
              <button
                type="button"
                onClick={() => setShowNewForm(true)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
              >
                <Plus className="h-3.5 w-3.5" />
                Nuevo proveedor
              </button>
            ) : (
              <div className="space-y-2 p-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--color-text)]">
                    Nuevo proveedor
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={newProv.nombre}
                  onChange={(e) =>
                    setNewProv({ ...newProv, nombre: e.target.value })
                  }
                  placeholder="Nombre *"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-1 text-xs text-[var(--color-text)] focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={newProv.rut}
                    onChange={(e) =>
                      setNewProv({ ...newProv, rut: e.target.value })
                    }
                    placeholder="RUT"
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-1 text-xs text-[var(--color-text)] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newProv.telefono}
                    onChange={(e) =>
                      setNewProv({ ...newProv, telefono: e.target.value })
                    }
                    placeholder="Telefono"
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-1 text-xs text-[var(--color-text)] focus:outline-none"
                  />
                  <input
                    type="email"
                    value={newProv.email}
                    onChange={(e) =>
                      setNewProv({ ...newProv, email: e.target.value })
                    }
                    placeholder="Email"
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-1 text-xs text-[var(--color-text)] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newProv.direccion}
                    onChange={(e) =>
                      setNewProv({ ...newProv, direccion: e.target.value })
                    }
                    placeholder="Direccion"
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-1 text-xs text-[var(--color-text)] focus:outline-none"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={!newProv.nombre.trim() || saving}
                >
                  {saving ? "Guardando..." : "Crear proveedor"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
