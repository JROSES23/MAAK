'use client';
import { useCallback, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Sucursal } from '@/lib/types';

export function useSucursales() {
  const supabase = createSupabaseClient();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('sucursales').select('*').order('created_at');
    if (error) setError(error.message);
    setSucursales((data as Sucursal[]) ?? []);
    setLoading(false);
  }, [supabase]);

  const createSucursal = async (nombre: string, direccion: string) => {
    const { error } = await supabase.from('sucursales').insert({ nombre, direccion });
    if (error) throw error;
    await refetch();
  };

  useEffect(() => { void refetch(); }, [refetch]);
  return { sucursales, loading, error, refetch, createSucursal };
}
