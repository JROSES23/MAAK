import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Trabajador } from "@/lib/types";

/**
 * Hook para gestionar trabajadores.
 * Tabla: trabajadores (id, nombre, rut, rol, sucursal_id, fecha_ingreso, estado, sueldo_base, email, telefono, created_at)
 * JOIN: sucursales (nunca guardar nombre de sucursal, siempre sucursal_id)
 */
export function useTrabajadores() {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  /** Carga trabajadores con JOIN a sucursales */
  const fetchTrabajadores = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("trabajadores")
      .select(`
        *,
        sucursal:sucursales(id, nombre, direccion, telefono, color)
      `)
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error al cargar trabajadores:", error.message);
    }
    if (data) {
      setTrabajadores(data as unknown as Trabajador[]);
    }
    setLoading(false);
  }, [supabase]);

  /** Crea un nuevo trabajador */
  const createTrabajador = useCallback(
    async (worker: Omit<Trabajador, "id" | "sucursal" | "created_at">) => {
      const { data, error } = await supabase
        .from("trabajadores")
        .insert({
          nombre: worker.nombre,
          rut: worker.rut,
          rol: worker.rol,
          sucursal_id: worker.sucursal_id,
          fecha_ingreso: worker.fecha_ingreso,
          estado: worker.estado,
          sueldo_base: worker.sueldo_base,
          email: worker.email,
          telefono: worker.telefono,
        })
        .select(`*, sucursal:sucursales(id, nombre, direccion, telefono, color)`)
        .single();

      if (error) {
        console.error("Error al crear trabajador:", error.message);
        return null;
      }
      if (data) {
        setTrabajadores((prev) => [data as unknown as Trabajador, ...prev]);
      }
      return data as unknown as Trabajador | null;
    },
    [supabase]
  );

  /** Actualiza un trabajador existente */
  const editTrabajador = useCallback(
    async (worker: Trabajador) => {
      const { id, sucursal, ...rest } = worker;
      void sucursal;

      const { data, error } = await supabase
        .from("trabajadores")
        .update(rest)
        .eq("id", id)
        .select(`*, sucursal:sucursales(id, nombre, direccion, telefono, color)`)
        .single();

      if (error) {
        console.error("Error al actualizar trabajador:", error.message);
        return false;
      }
      if (data) {
        setTrabajadores((prev) =>
          prev.map((t) => (t.id === id ? (data as unknown as Trabajador) : t))
        );
      }
      return true;
    },
    [supabase]
  );

  /** Desactiva un trabajador (soft delete) */
  const deactivateTrabajador = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("trabajadores")
        .update({ estado: "inactivo" })
        .eq("id", id);

      if (error) {
        console.error("Error al desactivar trabajador:", error.message);
        return false;
      }
      setTrabajadores((prev) =>
        prev.map((t) => (t.id === id ? { ...t, estado: "inactivo" as const } : t))
      );
      return true;
    },
    [supabase]
  );

  /** Elimina un trabajador y datos asociados (hard delete) */
  const deleteTrabajador = useCallback(
    async (id: string) => {
      // Eliminar datos asociados
      await supabase.from("asistencias").delete().eq("trabajador_id", id);
      await supabase.from("pagos").delete().eq("trabajador_id", id);
      await supabase.from("preferencias_trabajador").delete().eq("trabajador_id", id);
      await supabase.from("contratos").delete().eq("trabajador_id", id);

      const { error } = await supabase.from("trabajadores").delete().eq("id", id);
      if (error) {
        console.error("Error al eliminar trabajador:", error.message);
        return false;
      }
      setTrabajadores((prev) => prev.filter((t) => t.id !== id));
      return true;
    },
    [supabase]
  );

  return {
    trabajadores,
    loading,
    fetchTrabajadores,
    createTrabajador,
    editTrabajador,
    deactivateTrabajador,
    deleteTrabajador,
  };
}
