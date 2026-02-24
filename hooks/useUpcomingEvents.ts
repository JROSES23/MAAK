'use client';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

export type UpcomingEvent = { id: string; titulo: string; fecha: string };

export function useUpcomingEvents(sucursalId: string, userId: string) {
  const supabase = createSupabaseClient();
  const [events, setEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    if (!sucursalId || !userId) return;
    const load = async () => {
      const now = new Date();
      const week = new Date(); week.setDate(now.getDate() + 7);
      const [pedidos, rems, gastos] = await Promise.all([
        supabase.from('pedidos').select('id,fecha_pedido').eq('sucursal_id', sucursalId).gte('fecha_pedido', now.toISOString()).lte('fecha_pedido', week.toISOString()).limit(3),
        supabase.from('remuneraciones').select('id,fecha_pago').eq('es_quincena', true).gte('fecha_pago', now.toISOString()).lte('fecha_pago', week.toISOString()).limit(3),
        supabase.from('gastos_personales').select('id,fecha,descripcion').eq('user_id', userId).gte('fecha', now.toISOString()).lte('fecha', week.toISOString()).limit(3)
      ]);

      const merged: UpcomingEvent[] = [
        ...(pedidos.data ?? []).map((p) => ({ id: `p-${p.id}`, titulo: 'Pedido próximo', fecha: p.fecha_pedido })),
        ...(rems.data ?? []).map((r) => ({ id: `r-${r.id}`, titulo: 'Pago quincena', fecha: r.fecha_pago })),
        ...(gastos.data ?? []).map((g) => ({ id: `g-${g.id}`, titulo: g.descripcion || 'Gasto personal', fecha: g.fecha }))
      ].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()).slice(0, 5);

      setEvents(merged);
    };
    void load();
  }, [sucursalId, userId, supabase]);

  return events;
}
