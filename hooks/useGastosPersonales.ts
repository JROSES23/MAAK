'use client';
import { useCallback, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { GastoPersonal } from '@/lib/types';

export function useGastosPersonales(userId: string) {
  const supabase = createSupabaseClient();
  const [gastos, setGastos] = useState<GastoPersonal[]>([]);
  const refetch = useCallback(async () => {
    const { data } = await supabase.from('gastos_personales').select('*').eq('user_id', userId).order('fecha', { ascending: false });
    setGastos((data as GastoPersonal[]) ?? []);
  }, [supabase, userId]);
  useEffect(() => { if (userId) void refetch(); }, [refetch, userId]);
  return {
    gastos, refetch,
    createGasto: async (input: Omit<GastoPersonal, 'id' | 'created_at'>) => { await supabase.from('gastos_personales').insert(input); await refetch(); },
    updateGasto: async (id: string, input: Partial<GastoPersonal>) => { await supabase.from('gastos_personales').update(input).eq('id', id); await refetch(); },
    deleteGasto: async (id: string) => { await supabase.from('gastos_personales').delete().eq('id', id); await refetch(); }
  };
}
