'use client';
import { useCallback, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Remuneracion } from '@/lib/types';

export type RemuneracionRow = Remuneracion & { trabajadores?: { nombre: string } | null };

export function useRemuneraciones(sucursalId: string) {
  const supabase = createSupabaseClient();
  const [remuneraciones, setRemuneraciones] = useState<RemuneracionRow[]>([]);
  const refetch = useCallback(async () => {
    if (!sucursalId) return;
    const { data } = await supabase
      .from('remuneraciones')
      .select('*, trabajadores(nombre, sucursal_id)')
      .eq('trabajadores.sucursal_id', sucursalId)
      .order('fecha_pago', { ascending: false });
    setRemuneraciones((data as RemuneracionRow[]) ?? []);
  }, [sucursalId, supabase]);
  useEffect(() => { void refetch(); }, [refetch]);
  return {
    remuneraciones, refetch,
    createRemuneracion: async (input: Omit<Remuneracion, 'id' | 'created_at'>) => { await supabase.from('remuneraciones').insert(input); await refetch(); },
    updateRemuneracion: async (id: string, input: Partial<Remuneracion>) => { await supabase.from('remuneraciones').update(input).eq('id', id); await refetch(); },
    deleteRemuneracion: async (id: string) => { await supabase.from('remuneraciones').delete().eq('id', id); await refetch(); }
  };
}
