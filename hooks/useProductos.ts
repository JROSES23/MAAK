import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Producto } from "@/lib/types";

/**
 * Hook para gestionar productos.
 * Tabla: productos (id, nombre, unidad_default, categoria, created_at)
 */
export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  /** Carga todos los productos desde Supabase */
  const fetchProductos = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error al cargar productos:", error.message);
    }
    if (data) {
      setProductos(data as Producto[]);
    }
    setLoading(false);
  }, [supabase]);

  /** Crea un producto nuevo (o retorna el existente si ya existe por nombre) */
  const createProducto = useCallback(
    async (prod: Omit<Producto, "id" | "created_at">) => {
      // Verificar si ya existe
      const existing = productos.find(
        (p) => p.nombre.toLowerCase() === prod.nombre.toLowerCase()
      );
      if (existing) return existing;

      const { data, error } = await supabase
        .from("productos")
        .insert(prod)
        .select()
        .single();

      if (error) {
        console.error("Error al crear producto:", error.message);
        return null;
      }
      if (data) {
        setProductos((prev) => [...prev, data as Producto]);
      }
      return data as Producto | null;
    },
    [supabase, productos]
  );

  return {
    productos,
    loading,
    fetchProductos,
    createProducto,
  };
}
