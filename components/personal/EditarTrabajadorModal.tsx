"use client";

import { useState, useEffect } from "react";
import { X, Save, UserX, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Trabajador, RolTrabajador, EstadoTrabajador } from "@/lib/types";
import type { Branch } from "@/store/useBranchesStore";

const ROL_LABELS: Record<RolTrabajador, string> = {
  vendedor: "Vendedor",
  bodeguero: "Bodeguero",
  cajero: "Cajero",
  jefe_sucursal: "Jefe Sucursal",
  administrador: "Administrador",
  auxiliar: "Auxiliar",
};
const ROLES: RolTrabajador[] = [
  "vendedor",
  "bodeguero",
  "cajero",
  "jefe_sucursal",
  "administrador",
  "auxiliar",
];

interface EditarTrabajadorModalProps {
  open: boolean;
  onClose: () => void;
  trabajador: Trabajador | null;
  sucursales: Branch[];
  onSave: (worker: Trabajador) => Promise<boolean>;
  onDeactivate: (id: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function EditarTrabajadorModal({
  open,
  onClose,
  trabajador,
  sucursales,
  onSave,
  onDeactivate,
  onDelete,
}: EditarTrabajadorModalProps) {
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    rol: "vendedor" as RolTrabajador,
    sucursal_id: "",
    sueldo_base: 0,
    email: "",
    telefono: "",
    fecha_ingreso: "",
    estado: "activo" as EstadoTrabajador,
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (trabajador) {
      setForm({
        nombre: trabajador.nombre,
        rut: trabajador.rut,
        rol: trabajador.rol,
        sucursal_id: trabajador.sucursal_id,
        sueldo_base: trabajador.sueldo_base,
        email: trabajador.email,
        telefono: trabajador.telefono,
        fecha_ingreso: trabajador.fecha_ingreso,
        estado: trabajador.estado,
      });
    }
    setShowDeleteConfirm(false);
  }, [trabajador]);

  if (!open || !trabajador) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...trabajador, ...form });
    setSaving(false);
    onClose();
  };

  const handleDeactivate = async () => {
    setSaving(true);
    await onDeactivate(trabajador.id);
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    setSaving(true);
    await onDelete(trabajador.id);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Editar — {trabajador.nombre}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Nombre
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                RUT
              </label>
              <input
                type="text"
                value={form.rut}
                onChange={(e) => setForm({ ...form, rut: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Rol
              </label>
              <select
                value={form.rol}
                onChange={(e) =>
                  setForm({ ...form, rol: e.target.value as RolTrabajador })
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROL_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Sucursal
              </label>
              <select
                value={form.sucursal_id}
                onChange={(e) =>
                  setForm({ ...form, sucursal_id: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
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
                Sueldo base
              </label>
              <input
                type="number"
                value={form.sueldo_base}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sueldo_base: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Telefono
              </label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Fecha ingreso
              </label>
              <input
                type="date"
                value={form.fecha_ingreso}
                onChange={(e) =>
                  setForm({ ...form, fecha_ingreso: e.target.value })
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none"
              />
            </div>
          </div>

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Estas segura? Se eliminaran todos los datos asociados.
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Confirmar eliminacion
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-6 py-4">
          <div className="flex gap-2">
            {form.estado === "activo" && (
              <Button
                variant="secondary"
                size="sm"
                icon={UserX}
                onClick={handleDeactivate}
                disabled={saving}
              >
                Desactivar
              </Button>
            )}
            {!showDeleteConfirm && (
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => setShowDeleteConfirm(true)}
                disabled={saving}
              >
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button icon={Save} onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
