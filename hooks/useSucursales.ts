import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBranchesStore, type Branch } from "@/store/useBranchesStore";

/**
 * Hook para gestionar sucursales.
 * Tabla: sucursales (id, nombre, direccion, telefono, color, created_at)
 * Usa el store global useBranchesStore para mantener estado sincronizado.
 */
export function useSucursales() {
  const { branches, setBranches, addBranch, updateBranch, deleteBranch, loading } =
    useBranchesStore();

  const supabase = createClient();

  /** Carga todas las sucursales desde Supabase y actualiza el store */
  const fetchSucursales = useCallback(async () => {
    const { data, error } = await supabase
      .from("sucursales")
      .select("id, nombre, direccion, telefono, color, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar sucursales:", error.message);
      return;
    }
    if (data) {
      setBranches(data as Branch[]);
    }
  }, [supabase, setBranches]);

  /** Crea una nueva sucursal en Supabase y la agrega al store */
  const createSucursal = useCallback(
    async (sucursal: Omit<Branch, "id">) => {
      const { data, error } = await supabase
        .from("sucursales")
        .insert(sucursal)
        .select()
        .single();

      if (error) {
        console.error("Error al crear sucursal:", error.message);
        return null;
      }
      if (data) {
        addBranch(data as Branch);
      }
      return data as Branch | null;
    },
    [supabase, addBranch]
  );

  /** Actualiza una sucursal en Supabase y en el store */
  const editSucursal = useCallback(
    async (branch: Branch) => {
      const { id, ...rest } = branch;
      const { error } = await supabase
        .from("sucursales")
        .update(rest)
        .eq("id", id);

      if (error) {
        console.error("Error al actualizar sucursal:", error.message);
        return false;
      }
      updateBranch(branch);
      return true;
    },
    [supabase, updateBranch]
  );

  /** Elimina una sucursal. Verifica que no tenga pedidos activos antes. */
  const removeSucursal = useCallback(
    async (id: string): Promise<{ ok: boolean; message?: string }> => {
      // Verificar pedidos activos
      const { count } = await supabase
        .from("pedidos")
        .select("id", { count: "exact", head: true })
        .eq("sucursal_id", id)
        .in("estado", ["borrador", "pendiente", "enviado"]);

      if (count && count > 0) {
        return {
          ok: false,
          message: `No se puede eliminar: tiene ${count} pedido(s) activo(s) asociado(s).`,
        };
      }

      const { error } = await supabase.from("sucursales").delete().eq("id", id);
      if (error) {
        return { ok: false, message: error.message };
      }
      deleteBranch(id);
      return { ok: true };
    },
    [supabase, deleteBranch]
  );

  return {
    sucursales: branches,
    loading,
    fetchSucursales,
    createSucursal,
    editSucursal,
    removeSucursal,
  };
}
