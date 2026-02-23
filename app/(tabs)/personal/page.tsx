'use client';

import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type Categoria = { id: string; nombre: string };
type Gasto = { id: string; categoria_id: string; monto: number; fecha: string; descripcion: string | null; datos_adicionales: string | null };

export default function PersonalPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);

  const load = async () => {
    const [cat, gas] = await Promise.all([
      supabase.from('categorias_personales').select('id,nombre').limit(50),
      supabase.from('gastos_personales').select('id,categoria_id,monto,fecha,descripcion,datos_adicionales').order('fecha', { ascending: false }).limit(100)
    ]);
    setCategorias((cat.data as Categoria[]) ?? []);
    setGastos((gas.data as Gasto[]) ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const createCategoria = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await supabase.from('categorias_personales').insert({ nombre: form.get('nombre') });
    event.currentTarget.reset();
    void load();
  };

  const createGasto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await supabase.from('gastos_personales').insert({
      categoria_id: form.get('categoria_id'),
      monto: Number(form.get('monto')),
      fecha: form.get('fecha'),
      descripcion: form.get('descripcion'),
      datos_adicionales: form.get('datos_adicionales')
    });
    event.currentTarget.reset();
    void load();
  };

  const resumenPorCategoria = gastos.reduce<Record<string, number>>((acc, gasto) => {
    acc[gasto.categoria_id] = (acc[gasto.categoria_id] ?? 0) + Number(gasto.monto);
    return acc;
  }, {});

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Gastos personales</h1>

      <form onSubmit={createCategoria} className="flex gap-2 rounded-2xl bg-white p-4 shadow-sm">
        <input name="nombre" required className="flex-1 rounded-lg border px-3 py-2" placeholder="Agregar categoría" />
        <button className="rounded-lg bg-rose-500 px-3 py-2 text-white">Agregar categoría</button>
      </form>

      <form onSubmit={createGasto} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
        <select name="categoria_id" required className="rounded-lg border px-3 py-2">
          <option value="">Categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
          ))}
        </select>
        <input type="number" name="monto" required className="rounded-lg border px-3 py-2" placeholder="Monto" />
        <input type="date" name="fecha" required className="rounded-lg border px-3 py-2" />
        <input name="descripcion" className="rounded-lg border px-3 py-2 md:col-span-3" placeholder="Descripción" />
        <textarea name="datos_adicionales" className="rounded-lg border px-3 py-2 md:col-span-3" placeholder="Datos extra (opcional)" />
        <button className="rounded-lg bg-rose-600 px-3 py-2 text-white md:col-span-1">Guardar gasto</button>
      </form>

      <article className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-lg font-medium">Resumen mensual</h2>
        <ul className="space-y-1 text-sm">
          {Object.entries(resumenPorCategoria).map(([categoriaId, total]) => (
            <li key={categoriaId}>Categoría {categoriaId}: ${total.toLocaleString('es-CL')}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
