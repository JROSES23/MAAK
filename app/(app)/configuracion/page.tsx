"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Sun,
  Moon,
  Palette,
  Monitor,
  Check,
  DollarSign,
  UserCircle,
  Shield,
  Crown,
  Star,
  Save,
  LogOut,
  Building2,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  useThemeStore,
  PRESET_LABELS,
  PRESET_COLORS,
  MODE_LABELS,
  type ColorPreset,
  type ThemeMode,
  type AvatarId,
} from "@/store/theme-store";
import { useBranchesStore, type Branch } from "@/store/useBranchesStore";
import { useSucursales } from "@/hooks/useSucursales";
import { cn, formatCLP } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const PRESETS = Object.entries(PRESET_LABELS) as [ColorPreset, string][];
const MODES: ThemeMode[] = ["light", "dark", "black"];
const MODE_ICONS = { light: Sun, dark: Moon, black: Monitor };
const MODE_DESCRIPTIONS = {
  light: "Fondo luminoso y suave",
  dark: "Fondo oscuro profesional",
  black: "Fondo negro total (OLED)",
};

const AVATARS: { id: AvatarId; icon: typeof UserCircle; label: string }[] = [
  { id: "avatar1", icon: UserCircle, label: "Clasico" },
  { id: "avatar2", icon: Shield, label: "Escudo" },
  { id: "avatar3", icon: Crown, label: "Corona" },
  { id: "avatar4", icon: Star, label: "Estrella" },
];

const BRANCH_COLORS = [
  "#f4a7bb", "#98d4bb", "#c3a6d8", "#8ec5e8", "#f7c59f",
  "#f0d789", "#b2c9ab", "#f08a7e", "#b0aeab", "#dda0dd",
];

export default function ConfiguracionPage() {
  const router = useRouter();
  const {
    mode,
    preset,
    budget,
    userProfile,
    setMode,
    setPreset,
    setBudget,
    setUserProfile,
  } = useThemeStore();
  const branches = useBranchesStore((s) => s.branches);
  const { createSucursal, editSucursal, removeSucursal } = useSucursales();

  const [tempBudget, setTempBudget] = useState(budget.toString());
  const [tempName, setTempName] = useState(userProfile.name);
  const [loggingOut, setLoggingOut] = useState(false);

  // Sucursales edit state
  const [editingSucursal, setEditingSucursal] = useState<Branch | null>(null);
  const [editSucForm, setEditSucForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    color: "",
  });
  const [showNewSucursal, setShowNewSucursal] = useState(false);
  const [newSucForm, setNewSucForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    color: BRANCH_COLORS[0],
  });
  const [sucError, setSucError] = useState("");
  const [savingSuc, setSavingSuc] = useState(false);

  useEffect(() => {
    setTempBudget(budget.toString());
  }, [budget]);

  const saveBudget = () => {
    const num = parseInt(tempBudget);
    if (!isNaN(num) && num > 0) setBudget(num);
  };

  const saveName = () => {
    if (tempName.trim()) setUserProfile({ name: tempName.trim() });
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Even if signOut fails, redirect to login
    }
    router.push("/login");
    router.refresh();
  };

  // Sucursales CRUD
  const startEditSucursal = (suc: Branch) => {
    setEditingSucursal(suc);
    setEditSucForm({
      nombre: suc.nombre,
      direccion: suc.direccion || "",
      telefono: suc.telefono || "",
      color: suc.color || BRANCH_COLORS[0],
    });
    setSucError("");
  };

  const saveEditSucursal = async () => {
    if (!editingSucursal || !editSucForm.nombre.trim()) return;
    setSavingSuc(true);
    const ok = await editSucursal({
      id: editingSucursal.id,
      nombre: editSucForm.nombre.trim(),
      direccion: editSucForm.direccion.trim(),
      telefono: editSucForm.telefono.trim(),
      color: editSucForm.color,
    });
    if (ok) {
      setEditingSucursal(null);
      setSucError("");
    } else {
      setSucError("Error al guardar cambios.");
    }
    setSavingSuc(false);
  };

  const handleDeleteSucursal = async (id: string) => {
    setSavingSuc(true);
    const result = await removeSucursal(id);
    if (!result.ok) {
      setSucError(result.message || "Error al eliminar.");
    } else {
      setSucError("");
    }
    setSavingSuc(false);
  };

  const handleAddSucursal = async () => {
    if (!newSucForm.nombre.trim()) return;
    setSavingSuc(true);
    const created = await createSucursal({
      nombre: newSucForm.nombre.trim(),
      direccion: newSucForm.direccion.trim(),
      telefono: newSucForm.telefono.trim(),
      color: newSucForm.color,
    });
    if (created) {
      setNewSucForm({
        nombre: "",
        direccion: "",
        telefono: "",
        color: BRANCH_COLORS[0],
      });
      setShowNewSucursal(false);
      setSucError("");
    } else {
      setSucError("Error al crear sucursal.");
    }
    setSavingSuc(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <SectionHeader
        title="Configuracion"
        subtitle="Personaliza tu experiencia en MAAK"
        icon={Settings}
      />

      {/* Perfil de usuario */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--color-accent)]/10 p-2">
              <UserCircle className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Perfil de usuario
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Tu nombre y avatar
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">
              Nombre
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              />
              <Button size="sm" onClick={saveName} icon={Save}>
                Guardar
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">
              Avatar
            </label>
            <div className="flex gap-3">
              {AVATARS.map((av) => {
                const isActive = userProfile.avatar === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => setUserProfile({ avatar: av.id })}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                      isActive
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                        : "border-[var(--color-border)] bg-[var(--color-surface-alt)] hover:border-[var(--color-accent)]/30"
                    )}
                  >
                    <av.icon
                      className={cn(
                        "h-8 w-8",
                        isActive
                          ? "text-[var(--color-accent)]"
                          : "text-[var(--color-muted)]"
                      )}
                    />
                    <span className="text-[10px] text-[var(--color-muted)]">
                      {av.label}
                    </span>
                    {isActive && (
                      <Check className="h-3 w-3 text-[var(--color-accent)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Presupuesto mensual */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--color-accent)]/10 p-2">
              <DollarSign className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Presupuesto mensual
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Define el presupuesto base para el mes actual
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] pl-9 pr-3 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <Button onClick={saveBudget} icon={Save}>
              Guardar
            </Button>
          </div>

          <p className="text-xs text-[var(--color-muted)]">
            Valor actual: {formatCLP(budget)} — Se usa en dashboard, graficos y
            reportes.
          </p>
        </div>
      </Card>

      {/* Sucursales */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[var(--color-accent)]/10 p-2">
                <Building2 className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Sucursales
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Administra las sucursales de tu negocio
                </p>
              </div>
            </div>
            <Button
              size="sm"
              icon={Plus}
              onClick={() => setShowNewSucursal(true)}
            >
              Agregar
            </Button>
          </div>

          {sucError && (
            <div className="rounded-lg bg-red-500/10 px-4 py-2 text-xs text-red-400">
              {sucError}
            </div>
          )}

          {/* Sucursales list */}
          <div className="space-y-2">
            {branches.map((suc) => (
              <div key={suc.id}>
                {editingSucursal?.id === suc.id ? (
                  <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-surface-alt)] p-3 space-y-2">
                    <input
                      type="text"
                      value={editSucForm.nombre}
                      onChange={(e) =>
                        setEditSucForm({
                          ...editSucForm,
                          nombre: e.target.value,
                        })
                      }
                      placeholder="Nombre"
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none"
                    />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        type="text"
                        value={editSucForm.direccion}
                        onChange={(e) =>
                          setEditSucForm({
                            ...editSucForm,
                            direccion: e.target.value,
                          })
                        }
                        placeholder="Direccion"
                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editSucForm.telefono}
                        onChange={(e) =>
                          setEditSucForm({
                            ...editSucForm,
                            telefono: e.target.value,
                          })
                        }
                        placeholder="Telefono"
                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none"
                      />
                    </div>
                    {/* Color picker */}
                    <div className="space-y-1">
                      <label className="text-xs text-[var(--color-muted)]">
                        Color
                      </label>
                      <div className="flex gap-2">
                        {BRANCH_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() =>
                              setEditSucForm({ ...editSucForm, color: c })
                            }
                            className={cn(
                              "h-6 w-6 rounded-full border-2 transition-all",
                              editSucForm.color === c
                                ? "border-white scale-110"
                                : "border-transparent"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingSucursal(null)}
                        className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={saveEditSucursal}
                        disabled={savingSuc}
                        className="rounded-lg p-1.5 text-[var(--color-accent)] hover:text-[var(--color-accent)]"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl bg-[var(--color-surface-alt)] p-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className="h-4 w-4 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: suc.color || BRANCH_COLORS[0],
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text)]">
                          {suc.nombre}
                        </p>
                        <p className="text-xs text-[var(--color-muted)] truncate">
                          {suc.direccion || "—"} — {suc.telefono || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => startEditSucursal(suc)}
                        className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSucursal(suc.id)}
                        disabled={savingSuc}
                        className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {branches.length === 0 && (
              <p className="text-xs text-[var(--color-muted)] text-center py-4">
                No hay sucursales configuradas.
              </p>
            )}
          </div>

          {/* New sucursal form */}
          {showNewSucursal && (
            <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-surface-alt)] p-3 space-y-2">
              <input
                type="text"
                value={newSucForm.nombre}
                onChange={(e) =>
                  setNewSucForm({ ...newSucForm, nombre: e.target.value })
                }
                placeholder="Nombre de la sucursal"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={newSucForm.direccion}
                  onChange={(e) =>
                    setNewSucForm({ ...newSucForm, direccion: e.target.value })
                  }
                  placeholder="Direccion"
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none"
                />
                <input
                  type="text"
                  value={newSucForm.telefono}
                  onChange={(e) =>
                    setNewSucForm({ ...newSucForm, telefono: e.target.value })
                  }
                  placeholder="Telefono"
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none"
                />
              </div>
              {/* Color picker */}
              <div className="space-y-1">
                <label className="text-xs text-[var(--color-muted)]">
                  Color
                </label>
                <div className="flex gap-2">
                  {BRANCH_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        setNewSucForm({ ...newSucForm, color: c })
                      }
                      className={cn(
                        "h-6 w-6 rounded-full border-2 transition-all",
                        newSucForm.color === c
                          ? "border-white scale-110"
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setShowNewSucursal(false);
                    setNewSucForm({
                      nombre: "",
                      direccion: "",
                      telefono: "",
                      color: BRANCH_COLORS[0],
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddSucursal}
                  disabled={!newSucForm.nombre.trim() || savingSuc}
                >
                  {savingSuc ? "Guardando..." : "Agregar"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modo de apariencia */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--color-accent)]/10 p-2">
              <Monitor className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Modo de apariencia
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Elige el tono de fondo de la interfaz
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {MODES.map((m) => {
              const Icon = MODE_ICONS[m];
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                    isActive
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                      : "border-[var(--color-border)] bg-[var(--color-surface-alt)] hover:border-[var(--color-accent)]/30"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive
                        ? "text-[var(--color-accent)]"
                        : m === "light"
                        ? "text-amber-400"
                        : "text-[var(--color-muted)]"
                    )}
                  />
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    {MODE_LABELS[m]}
                  </span>
                  <span className="text-[10px] text-[var(--color-muted)] text-center">
                    {MODE_DESCRIPTIONS[m]}
                  </span>
                  {isActive && (
                    <Check className="h-4 w-4 text-[var(--color-accent)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Paleta de color */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--color-accent)]/10 p-2">
              <Palette className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Paleta de color
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Cambia el color de acento de la interfaz
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESETS.map(([key, label]) => {
              const color = PRESET_COLORS[key];
              const isActive = preset === key;
              return (
                <button
                  key={key}
                  onClick={() => setPreset(key)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 transition-all",
                    isActive
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                      : "border-[var(--color-border)] bg-[var(--color-surface-alt)] hover:border-[var(--color-accent)]/30"
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex-shrink-0 border-2",
                      isActive ? "border-[var(--color-text)]" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {label}
                    </p>
                  </div>
                  {isActive && (
                    <Check className="h-4 w-4 flex-shrink-0 text-[var(--color-accent)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card>
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
          Vista previa
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Button size="sm">Primario</Button>
            <Button size="sm" variant="secondary">
              Secundario
            </Button>
            <Button size="sm" variant="ghost">
              Ghost
            </Button>
          </div>
          <div className="rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 p-4">
            <p className="text-sm text-[var(--color-accent)]">
              Los botones, badges, iconos y graficos usaran esta paleta de
              color.
            </p>
          </div>
        </div>
      </Card>

      {/* Cerrar sesion */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-2">
              <LogOut className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Cerrar sesion
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Cierra tu sesion actual y vuelve al inicio de sesion
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            icon={LogOut}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Cerrando sesion..." : "Cerrar sesion"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
