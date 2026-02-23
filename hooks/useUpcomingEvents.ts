'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export type UpcomingEvent = { id: string; message: string };

export function useUpcomingEvents(daysAhead = 7) {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    const load = async () => {
      const now = new Date();
      const until = new Date();
      until.setDate(now.getDate() + daysAhead);

      const [pedidos, quincenas] = await Promise.all([
        supabase
          .from('pedidos')
          .select('id,fecha_pedido,proveedor_id')
          .gte('fecha_pedido', now.toISOString())
          .lte('fecha_pedido', until.toISOString())
          .limit(10),
        supabase
          .from('remuneraciones')
          .select('id,fecha_pago')
          .eq('es_quincena', true)
          .gte('fecha_pago', now.toISOString())
          .lte('fecha_pago', until.toISOString())
          .limit(10)
      ]);

      const reminders: UpcomingEvent[] = [
        ...(pedidos.data ?? []).map((item) => ({
          id: `pedido-${item.id}`,
          message: `Pedido proveedor ${item.proveedor_id} programado para ${new Date(item.fecha_pedido).toLocaleDateString('es-CL')}`
        })),
        ...(quincenas.data ?? []).map((item) => ({
          id: `quincena-${item.id}`,
          message: `Pago de quincena el ${new Date(item.fecha_pago).toLocaleDateString('es-CL')}`
        })),
        { id: 'personal-mock', message: 'Recordatorio: revisar gastos personales recurrentes de fin de mes.' }
      ];

      setEvents(reminders);
    };

    void load();
  }, [daysAhead]);

  return events;
}
