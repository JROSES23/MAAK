'use client';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

type DashboardData = { pedidosProximos: number; quincenasProximas: number; pagosProveedoresProximos: number; gastosPersonalesMes: number };

export function useDashboardData(sucursalId: string, userId: string) {
  const supabase = createSupabaseClient();
  const [data, setData] = useState<DashboardData>({ pedidosProximos: 0, quincenasProximas: 0, pagosProveedoresProximos: 0, gastosPersonalesMes: 0 });

  useEffect(() => {
    if (!sucursalId) return;
    const load = async () => {
      const now = new Date();
      const today = now.toISOString();
      const week = new Date(now); week.setDate(now.getDate() + 7);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      const [pedidosCount, quincenasCount, pedidosRows, gastosRows] = await Promise.all([
        supabase.from('pedidos').select('id', { count: 'exact', head: true }).eq('sucursal_id', sucursalId).eq('estado', 'pendiente').gte('fecha_pedido', today).lte('fecha_pedido', week.toISOString()),
        supabase.from('remuneraciones').select('id', { count: 'exact', head: true }).eq('es_quincena', true).gte('fecha_pago', today).lte('fecha_pago', week.toISOString()),
        supabase.from('pedidos').select('monto_estimado').eq('sucursal_id', sucursalId).eq('estado', 'pendiente').gte('fecha_pedido', today).lte('fecha_pedido', week.toISOString()),
        supabase.from('gastos_personales').select('monto').eq('user_id', userId).gte('fecha', monthStart).lte('fecha', monthEnd)
      ]);

      setData({
        pedidosProximos: pedidosCount.count ?? 0,
        quincenasProximas: quincenasCount.count ?? 0,
        pagosProveedoresProximos: (pedidosRows.data ?? []).reduce((a, r) => a + Number(r.monto_estimado ?? 0), 0),
        gastosPersonalesMes: (gastosRows.data ?? []).reduce((a, r) => a + Number(r.monto ?? 0), 0)
      });
    };
    void load();
  }, [sucursalId, userId, supabase]);

  return data;
}
