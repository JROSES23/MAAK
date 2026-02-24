'use client';
import { useCallback, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Proveedor } from '@/lib/types';

export function useProveedores() {
  const supabase = createSupabaseClient();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const refetch = useCallback(async () => {
    const { data } = await supabase.from('proveedores').select('*').order('nombre');
    setProveedores((data as Proveedor[]) ?? []);
  }, [supabase]);
  useEffect(() => { void refetch(); }, [refetch]);
  return {
    proveedores, refetch,
    createProveedor: async (input: { nombre: string; contacto?: string }) => { await supabase.from('proveedores').insert(input); await refetch(); },
    updateProveedor: async (id: string, input: { nombre: string; contacto?: string }) => { await supabase.from('proveedores').update(input).eq('id', id); await refetch(); },
    deleteProveedor: async (id: string) => { await supabase.from('proveedores').delete().eq('id', id); await refetch(); }
  };
}
