'use client';
import { USER_ID_DEMO } from '@/lib/types';
import { useCurrentSucursal } from '@/hooks/useCurrentSucursal';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useUpcomingEvents } from '@/hooks/useUpcomingEvents';

export default function DashboardPage() {
  const { sucursalId } = useCurrentSucursal();
  const data = useDashboardData(sucursalId, USER_ID_DEMO);
  const events = useUpcomingEvents(sucursalId, USER_ID_DEMO);

  const cards = [
    ['Pedidos próximos (7 días)', data.pedidosProximos],
    ['Pagos de quincena próximos', data.quincenasProximas],
    ['Pagos proveedores próximos', `$${data.pagosProveedoresProximos.toLocaleString('es-CL')}`],
    ['Gastos personales este mes', `$${data.gastosPersonalesMes.toLocaleString('es-CL')}`]
  ];

  return <section className="space-y-4"> 
    <h2 className="text-2xl font-semibold">Dashboard</h2>
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{cards.map(([t,v]) => <article key={t} className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">{t}</p><p className="text-xl font-semibold">{v}</p></article>)}</div>
    <article className="rounded-2xl bg-white p-4 shadow-sm"><h3 className="mb-2 font-medium">Próximos eventos</h3><ul className="space-y-2 text-sm">{events.map((e) => <li key={e.id} className="rounded-xl bg-slate-50 px-3 py-2">{e.titulo} - {new Date(e.fecha).toLocaleDateString('es-CL')}</li>)}</ul></article>
  </section>;
}
