'use client';
import { useCallback, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Pedido } from '@/lib/types';

export function usePedidos(sucursalId: string) {
  const supabase = createSupabaseClient();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const refetch = useCallback(async () => {
    if (!sucursalId) return;
    const { data } = await supabase.from('pedidos').select('*').eq('sucursal_id', sucursalId).order('fecha_pedido', { ascending: false });
    setPedidos((data as Pedido[]) ?? []);
  }, [sucursalId, supabase]);
  useEffect(() => { void refetch(); }, [refetch]);
  return {
    pedidos, refetch,
    createPedido: async (input: Omit<Pedido, 'id' | 'created_at'>) => { await supabase.from('pedidos').insert(input); await refetch(); },
    updatePedido: async (id: string, input: Partial<Pedido>) => { await supabase.from('pedidos').update(input).eq('id', id); await refetch(); },
    deletePedido: async (id: string) => { await supabase.from('pedidos').delete().eq('id', id); await refetch(); }
  };
}
