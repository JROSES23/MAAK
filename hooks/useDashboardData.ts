'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type DashboardData = {
  pedidosProximos: number;
  quincenasProximas: number;
  pagosProveedores: number;
  gastosPersonalesMes: number;
};

export function useDashboardData(sucursalId: string) {
  const [data, setData] = useState<DashboardData>({
    pedidosProximos: 0,
    quincenasProximas: 0,
    pagosProveedores: 0,
    gastosPersonalesMes: 0
  });

  useEffect(() => {
    if (!sucursalId) return;

    const fetchData = async () => {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

      const [pedidos, quincenas, proveedores, gastos] = await Promise.all([
        supabase
          .from('pedidos')
          .select('id', { count: 'exact', head: true })
          .eq('sucursal_id', sucursalId)
          .eq('estado', 'pendiente')
          .lte('fecha_pedido', nextWeek.toISOString()),
        supabase
          .from('remuneraciones')
          .select('id', { count: 'exact', head: true })
          .eq('es_quincena', true)
          .gte('fecha_pago', today.toISOString())
          .lte('fecha_pago', nextWeek.toISOString()),
        supabase
          .from('pedidos')
          .select('monto_estimado')
          .eq('sucursal_id', sucursalId)
          .eq('estado', 'pendiente')
          .limit(50),
        supabase
          .from('gastos_personales')
          .select('monto')
          .gte('fecha', monthStart)
          .limit(100)
      ]);

      const pagosProveedores = (proveedores.data ?? []).reduce((sum, row) => sum + Number(row.monto_estimado ?? 0), 0);
      const gastosPersonalesMes = (gastos.data ?? []).reduce((sum, row) => sum + Number(row.monto ?? 0), 0);

      setData({
        pedidosProximos: pedidos.count ?? 0,
        quincenasProximas: quincenas.count ?? 0,
        pagosProveedores,
        gastosPersonalesMes
      });
    };

    void fetchData();
  }, [sucursalId]);

  return data;
}
