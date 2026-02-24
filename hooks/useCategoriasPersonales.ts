'use client';
import { useCallback, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { CategoriaPersonal } from '@/lib/types';

export function useCategoriasPersonales(userId: string) {
  const supabase = createSupabaseClient();
  const [categorias, setCategorias] = useState<CategoriaPersonal[]>([]);
  const refetch = useCallback(async () => {
    const { data } = await supabase.from('categorias_personales').select('*').eq('user_id', userId).order('nombre');
    setCategorias((data as CategoriaPersonal[]) ?? []);
  }, [supabase, userId]);
  useEffect(() => { if (userId) void refetch(); }, [refetch, userId]);
  return {
    categorias, refetch,
    createCategoria: async (nombre: string) => { await supabase.from('categorias_personales').insert({ user_id: userId, nombre }); await refetch(); },
    deleteCategoria: async (id: string) => { await supabase.from('categorias_personales').delete().eq('id', id); await refetch(); }
  };
}
