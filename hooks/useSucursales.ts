'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export type Sucursal = { id: string; nombre: string };

export function useSucursales() {
  const [data, setData] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSucursales = async () => {
      setLoading(true);
      const { data: rows, error: queryError } = await supabase
        .from('sucursales')
        .select('id,nombre')
        .order('nombre')
        .limit(20);

      if (queryError) {
        setError(queryError.message);
      } else {
        setData(rows ?? []);
      }
      setLoading(false);
    };

    void fetchSucursales();
  }, []);

  return { data, loading, error };
}
