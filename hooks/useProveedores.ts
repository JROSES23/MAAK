import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Proveedor } from "@/lib/types";

/**
 * Hook para gestionar proveedores.
 * Tabla: proveedores (id, nombre, rut, telefono, email, direccion, created_at)
 */
export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  /** Carga todos los proveedores desde Supabase */
  const fetchProveedores = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("proveedores")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error al cargar proveedores:", error.message);
    }
    if (data) {
      setProveedores(data as Proveedor[]);
    }
    setLoading(false);
  }, [supabase]);

  /** Crea un nuevo proveedor */
  const createProveedor = useCallback(
    async (prov: Omit<Proveedor, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("proveedores")
        .insert(prov)
        .select()
        .single();

      if (error) {
        console.error("Error al crear proveedor:", error.message);
        return null;
      }
      if (data) {
        setProveedores((prev) => [...prev, data as Proveedor]);
      }
      return data as Proveedor | null;
    },
    [supabase]
  );

  /** Actualiza un proveedor existente */
  const editProveedor = useCallback(
    async (prov: Proveedor) => {
      const { id, ...rest } = prov;
      const { error } = await supabase
        .from("proveedores")
        .update(rest)
        .eq("id", id);

      if (error) {
        console.error("Error al actualizar proveedor:", error.message);
        return false;
      }
      setProveedores((prev) => prev.map((p) => (p.id === id ? prov : p)));
      return true;
    },
    [supabase]
  );

  /** Elimina un proveedor. Verifica que no tenga pedidos asociados. */
  const removeProveedor = useCallback(
    async (id: string): Promise<{ ok: boolean; message?: string }> => {
      const { count } = await supabase
        .from("pedidos")
        .select("id", { count: "exact", head: true })
        .eq("proveedor_id", id);

      if (count && count > 0) {
        return {
          ok: false,
          message: `No se puede eliminar: tiene ${count} pedido(s) asociado(s).`,
        };
      }

      const { error } = await supabase.from("proveedores").delete().eq("id", id);
      if (error) {
        return { ok: false, message: error.message };
      }
      setProveedores((prev) => prev.filter((p) => p.id !== id));
      return { ok: true };
    },
    [supabase]
  );

  return {
    proveedores,
    loading,
    fetchProveedores,
    createProveedor,
    editProveedor,
    removeProveedor,
  };
}
