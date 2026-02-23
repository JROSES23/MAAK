'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type Remuneracion = {
  id: string;
  trabajador_id: string;
  fecha_pago: string;
  sueldo_base: number;
  bonos: number;
  es_quincena: boolean;
  datos_adicionales: string | null;
};

export default function RemuneracionesPage() {
  const [items, setItems] = useState<Remuneracion[]>([]);
  const [soloQuincena, setSoloQuincena] = useState(false);

  const load = useCallback(async () => {
    let query = supabase
      .from('remuneraciones')
      .select('id,trabajador_id,fecha_pago,sueldo_base,bonos,es_quincena,datos_adicionales')
      .order('fecha_pago', { ascending: false })
      .limit(50);
    if (soloQuincena) query = query.eq('es_quincena', true);
    const { data } = await query;
    setItems((data as Remuneracion[]) ?? []);
  }, [soloQuincena]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await supabase.from('remuneraciones').insert({
      trabajador_id: form.get('trabajador_id'),
      fecha_pago: form.get('fecha_pago'),
      sueldo_base: Number(form.get('sueldo_base')),
      bonos: Number(form.get('bonos')),
      es_quincena: form.get('es_quincena') === 'on',
      datos_adicionales: form.get('datos_adicionales')
    });
    event.currentTarget.reset();
    void load();
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Remuneraciones</h1>
      <label className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
        <input type="checkbox" checked={soloQuincena} onChange={(e) => setSoloQuincena(e.target.checked)} />
        Mostrar solo quincenas
      </label>

      <form onSubmit={create} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
        <input required name="trabajador_id" placeholder="Trabajador ID" className="rounded-lg border px-3 py-2" />
        <input required type="date" name="fecha_pago" className="rounded-lg border px-3 py-2" />
        <input required type="number" name="sueldo_base" placeholder="Sueldo base" className="rounded-lg border px-3 py-2" />
        <input type="number" name="bonos" placeholder="Bonos" className="rounded-lg border px-3 py-2" defaultValue={0} />
        <label className="inline-flex items-center gap-2 rounded-lg border px-3 py-2"><input type="checkbox" name="es_quincena" /> Es quincena</label>
        <textarea name="datos_adicionales" placeholder="Datos extra (opcional)" className="rounded-lg border px-3 py-2 md:col-span-3" />
        <button className="rounded-lg bg-sky-600 px-3 py-2 text-white md:col-span-1">Nuevo pago / remuneración</button>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={`rounded-xl p-3 shadow-sm ${item.es_quincena ? 'bg-amber-100' : 'bg-white'}`}>
            <p className="font-medium">Trabajador {item.trabajador_id}</p>
            <p className="text-sm text-slate-600">{new Date(item.fecha_pago).toLocaleDateString('es-CL')} · Total ${(Number(item.sueldo_base) + Number(item.bonos)).toLocaleString('es-CL')}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
