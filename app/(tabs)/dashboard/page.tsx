'use client';

import { SummaryCard } from '@/components/ui/SummaryCard';
import { useCurrentSucursal } from '@/hooks/useCurrentSucursal';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useSucursales } from '@/hooks/useSucursales';
import { useUpcomingEvents } from '@/hooks/useUpcomingEvents';

export default function DashboardPage() {
  const { data: sucursales } = useSucursales();
  const { sucursalId, setSucursalId } = useCurrentSucursal();
  const selectedSucursal = sucursalId || sucursales[0]?.id || '';
  const dashboard = useDashboardData(selectedSucursal);
  const events = useUpcomingEvents(7);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <select
          className="rounded-xl border border-slate-300 bg-white px-3 py-2"
          value={selectedSucursal}
          onChange={(event) => setSucursalId(event.target.value)}
        >
          <option value="">Selecciona sucursal</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal.id} value={sucursal.id}>
              {sucursal.nombre}
            </option>
          ))}
        </select>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard title="Pedidos próximos (7 días)" value={dashboard.pedidosProximos} tone="mint" />
        <SummaryCard title="Pagos de quincena próximos" value={dashboard.quincenasProximas} tone="blue" />
        <SummaryCard title="Pagos a proveedores próximos" value={`$${dashboard.pagosProveedores.toLocaleString('es-CL')}`} tone="rose" />
        <SummaryCard title="Gastos personales este mes" value={`$${dashboard.gastosPersonalesMes.toLocaleString('es-CL')}`} tone="slate" />
      </div>

      <article className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">Recordatorios</h2>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white"
            onClick={async () => {
              if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready;
                registration.active?.postMessage({ type: 'TEST_NOTIFICATION', message: 'Recordatorio de prueba desde dashboard.' });
              }
            }}
          >
            Probar notificación
          </button>
        </div>
        <ul className="space-y-2 text-sm text-slate-600">
          {events.map((event) => (
            <li key={event.id} className="rounded-lg bg-slate-50 px-3 py-2">
              {event.message}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
