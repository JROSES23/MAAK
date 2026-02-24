'use client';
import { useCallback, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Notificacion } from '@/lib/types';

export function useNotificaciones(userId: string) {
  const supabase = createSupabaseClient();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const refetch = useCallback(async () => {
    const { data } = await supabase.from('notificaciones').select('*').eq('user_id', userId).eq('leida', false).order('fecha_programada', { ascending: true }).limit(5);
    setNotificaciones((data as Notificacion[]) ?? []);
  }, [supabase, userId]);

  useEffect(() => { if (userId) void refetch(); }, [refetch, userId]);
  return { notificaciones, refetch };
}
