'use client';
import { useCallback, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Trabajador } from '@/lib/types';

export function useTrabajadores(sucursalId: string) {
  const supabase = createSupabaseClient();
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const refetch = useCallback(async () => {
    if (!sucursalId) return;
    const { data } = await supabase.from('trabajadores').select('*').eq('sucursal_id', sucursalId).order('nombre');
    setTrabajadores((data as Trabajador[]) ?? []);
  }, [sucursalId, supabase]);
  useEffect(() => { void refetch(); }, [refetch]);
  return {
    trabajadores, refetch,
    createTrabajador: async (input: { nombre: string; rut?: string; sucursal_id: string }) => { await supabase.from('trabajadores').insert(input); await refetch(); },
    updateTrabajador: async (id: string, input: Partial<Trabajador>) => { await supabase.from('trabajadores').update(input).eq('id', id); await refetch(); },
    deleteTrabajador: async (id: string) => { await supabase.from('trabajadores').delete().eq('id', id); await refetch(); }
  };
}
