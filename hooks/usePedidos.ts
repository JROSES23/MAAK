import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Pedido, PedidoItem, EstadoPedido } from "@/lib/types";

/**
 * Hook para gestionar pedidos.
 * Tablas: pedidos, pedido_items
 * JOINs: proveedores, sucursales, productos
 */
export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  /** Carga todos los pedidos con sus relaciones */
  const fetchPedidos = useCallback(async (filters?: {
    proveedor_id?: string;
    sucursal_id?: string;
    estado?: EstadoPedido;
    fecha_desde?: string;
    fecha_hasta?: string;
    monto_min?: number;
    monto_max?: number;
    search?: string;
  }) => {
    setLoading(true);
    let query = supabase
      .from("pedidos")
      .select(`
        *,
        proveedor:proveedores(*),
        sucursal:sucursales(*),
        items:pedido_items(
          *,
          producto:productos(*),
          sucursal:sucursales(*)
        )
      `)
      .order("fecha", { ascending: false });

    // Aplica filtros dinámicos
    if (filters?.proveedor_id) query = query.eq("proveedor_id", filters.proveedor_id);
    if (filters?.sucursal_id) query = query.eq("sucursal_id", filters.sucursal_id);
    if (filters?.estado) query = query.eq("estado", filters.estado);
    if (filters?.fecha_desde) query = query.gte("fecha", filters.fecha_desde);
    if (filters?.fecha_hasta) query = query.lte("fecha", filters.fecha_hasta);
    if (filters?.monto_min) query = query.gte("total_estimado", filters.monto_min);
    if (filters?.monto_max) query = query.lte("total_estimado", filters.monto_max);
    if (filters?.search) query = query.ilike("notas", `%${filters.search}%`);

    const { data, error } = await query;

    if (error) {
      console.error("Error al cargar pedidos:", error.message);
    }
    if (data) {
      setPedidos(data as unknown as Pedido[]);
    }
    setLoading(false);
  }, [supabase]);

  /** Crea un pedido con sus items */
  const createPedido = useCallback(
    async (
      pedido: Omit<Pedido, "id" | "items" | "proveedor" | "sucursal" | "created_at">,
      items: Omit<PedidoItem, "id" | "pedido_id" | "producto" | "sucursal" | "created_at">[]
    ) => {
      const { data: pedidoData, error: pedidoError } = await supabase
        .from("pedidos")
        .insert({
          fecha: pedido.fecha,
          proveedor_id: pedido.proveedor_id,
          sucursal_id: pedido.sucursal_id,
          estado: pedido.estado,
          notas: pedido.notas,
          total_estimado: pedido.total_estimado,
        })
        .select()
        .single();

      if (pedidoError || !pedidoData) {
        console.error("Error al crear pedido:", pedidoError?.message);
        return null;
      }

      // Insertar items
      const itemsToInsert = items.map((item) => ({
        pedido_id: pedidoData.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        unidad: item.unidad,
        precio_estimado: item.precio_estimado,
        sucursal_id: item.sucursal_id,
      }));

      const { error: itemsError } = await supabase
        .from("pedido_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Error al crear items del pedido:", itemsError.message);
      }

      return pedidoData;
    },
    [supabase]
  );

  /** Actualiza un pedido y sus items */
  const updatePedido = useCallback(
    async (
      id: string,
      pedido: Partial<Omit<Pedido, "id" | "items" | "proveedor" | "sucursal">>,
      items?: Omit<PedidoItem, "id" | "pedido_id" | "producto" | "sucursal" | "created_at">[]
    ) => {
      const { error: pedidoError } = await supabase
        .from("pedidos")
        .update(pedido)
        .eq("id", id);

      if (pedidoError) {
        console.error("Error al actualizar pedido:", pedidoError.message);
        return false;
      }

      if (items) {
        // Eliminar items anteriores y reinsertar
        await supabase.from("pedido_items").delete().eq("pedido_id", id);

        const itemsToInsert = items.map((item) => ({
          pedido_id: id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          unidad: item.unidad,
          precio_estimado: item.precio_estimado,
          sucursal_id: item.sucursal_id,
        }));

        const { error: itemsError } = await supabase
          .from("pedido_items")
          .insert(itemsToInsert);

        if (itemsError) {
          console.error("Error al actualizar items:", itemsError.message);
        }
      }

      return true;
    },
    [supabase]
  );

  /** Cambia el estado de un pedido */
  const changeEstado = useCallback(
    async (id: string, estado: EstadoPedido) => {
      const { error } = await supabase
        .from("pedidos")
        .update({ estado })
        .eq("id", id);

      if (error) {
        console.error("Error al cambiar estado:", error.message);
        return false;
      }
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado } : p))
      );
      return true;
    },
    [supabase]
  );

  /** Elimina un pedido y sus items (cascade) */
  const deletePedido = useCallback(
    async (id: string) => {
      await supabase.from("pedido_items").delete().eq("pedido_id", id);
      const { error } = await supabase.from("pedidos").delete().eq("id", id);
      if (error) {
        console.error("Error al eliminar pedido:", error.message);
        return false;
      }
      setPedidos((prev) => prev.filter((p) => p.id !== id));
      return true;
    },
    [supabase]
  );

  return {
    pedidos,
    loading,
    fetchPedidos,
    createPedido,
    updatePedido,
    changeEstado,
    deletePedido,
  };
}
