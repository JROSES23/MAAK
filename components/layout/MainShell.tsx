'use client';
import Link from 'next/link';
import { BottomNav } from '@/components/navigation/BottomNav';
import { useCurrentSucursal } from '@/hooks/useCurrentSucursal';
import { useSucursales } from '@/hooks/useSucursales';

export function MainShell({ children }: { children: React.ReactNode }) {
  const { sucursales, createSucursal } = useSucursales();
  const { sucursalId, setSucursalId } = useCurrentSucursal();
  const selected = sucursalId || sucursales[0]?.id || '';

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-24 pt-4 md:px-8">
      <header className="mx-auto mb-4 flex max-w-6xl items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">MAAK</h1>
        {sucursales.length === 0 ? (
          <button className="rounded-lg bg-sky-600 px-3 py-2 text-sm text-white" onClick={() => void createSucursal('Sucursal 1', 'Por definir')}>Crea tu primera sucursal</button>
        ) : (
          <select className="rounded-lg border px-3 py-2 text-sm" value={selected} onChange={(e) => setSucursalId(e.target.value)}>
            {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
        )}
        <Link href="/configuracion" className="rounded-lg border px-3 py-2 text-sm">Configuración</Link>
      </header>
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-[220px_1fr]">
        <div className="hidden md:block"><BottomNav /></div>
        <main>{children}</main>
      </div>
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
