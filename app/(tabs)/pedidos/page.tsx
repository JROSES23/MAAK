'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type Pedido = {
  id: string;
  proveedor_id: string;
  fecha_pedido: string;
  monto_estimado: number;
  estado: 'pendiente' | 'entregado' | 'cancelado';
  datos_adicionales: string | null;
};

export default function PedidosPage() {
  const [items, setItems] = useState<Pedido[]>([]);
  const [estado, setEstado] = useState<string>('');
  const [proveedor, setProveedor] = useState<string>('');

  const load = useCallback(async () => {
    let query = supabase
      .from('pedidos')
      .select('id,proveedor_id,fecha_pedido,monto_estimado,estado,datos_adicionales')
      .order('fecha_pedido', { ascending: false })
      .limit(50);

    if (estado) query = query.eq('estado', estado);
    if (proveedor) query = query.eq('proveedor_id', proveedor);

    const { data } = await query;
    setItems((data as Pedido[]) ?? []);
  }, [estado, proveedor]);

  useEffect(() => {
    void load();
  }, [load]);

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await supabase.from('pedidos').insert({
      sucursal_id: form.get('sucursal_id'),
      proveedor_id: form.get('proveedor_id'),
      fecha_pedido: form.get('fecha_pedido'),
      monto_estimado: Number(form.get('monto_estimado')),
      estado: form.get('estado'),
      datos_adicionales: form.get('datos_adicionales')
    });
    event.currentTarget.reset();
    void load();
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Pedidos a proveedores</h1>
      <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
        <input className="rounded-lg border px-3 py-2" placeholder="Filtrar proveedor" value={proveedor} onChange={(e) => setProveedor(e.target.value)} />
        <select className="rounded-lg border px-3 py-2" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <form onSubmit={onCreate} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
        <input required name="sucursal_id" placeholder="Sucursal ID" className="rounded-lg border px-3 py-2" />
        <input required name="proveedor_id" placeholder="Proveedor ID" className="rounded-lg border px-3 py-2" />
        <input required type="date" name="fecha_pedido" className="rounded-lg border px-3 py-2" />
        <input required type="number" name="monto_estimado" placeholder="Monto" className="rounded-lg border px-3 py-2" />
        <select required name="estado" className="rounded-lg border px-3 py-2">
          <option value="pendiente">Pendiente</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <textarea name="datos_adicionales" placeholder="Datos extra (opcional)" className="rounded-lg border px-3 py-2 md:col-span-2" />
        <button className="rounded-lg bg-emerald-600 px-3 py-2 text-white">Nuevo Pedido</button>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl bg-white p-3 shadow-sm">
            <p className="font-medium">Proveedor {item.proveedor_id}</p>
            <p className="text-sm text-slate-600">{item.estado} · {new Date(item.fecha_pedido).toLocaleDateString('es-CL')} · ${Number(item.monto_estimado).toLocaleString('es-CL')}</p>
            {item.datos_adicionales ? <p className="mt-1 text-sm text-slate-500">{item.datos_adicionales}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
