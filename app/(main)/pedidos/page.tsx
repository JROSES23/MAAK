'use client';
import { FormEvent, useMemo, useState } from 'react';
import { useCurrentSucursal } from '@/hooks/useCurrentSucursal';
import { usePedidos } from '@/hooks/usePedidos';
import { useProveedores } from '@/hooks/useProveedores';
import { useStoragePreference } from '@/hooks/useStoragePreference';
import { compressBeforeUpload, uploadToGoogleDriveStub, uploadToSupabaseStorage } from '@/lib/files';
import type { StoragePreference } from '@/lib/types';

export default function PedidosPage() {
  const { sucursalId } = useCurrentSucursal();
  const { proveedores, createProveedor, deleteProveedor } = useProveedores();
  const { pedidos, createPedido, deletePedido } = usePedidos(sucursalId);
  const { preference } = useStoragePreference();
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('');
  const filtered = useMemo(() => pedidos.filter((p) => !filtroEstado || p.estado === filtroEstado), [pedidos, filtroEstado]);

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true);
    const form = new FormData(e.currentTarget);
    const selectedPreference = (form.get('storage_preference') as StoragePreference) || preference;
    const file = form.get('adjunto') as File;
    let adjunto_local_path: string | null = null; let adjunto_drive_id: string | null = null;
    if (file?.size) {
      const compressed = await compressBeforeUpload(file);
      const up = await uploadToSupabaseStorage(compressed, { tipo: 'pedido', sucursalId, proveedorId: String(form.get('proveedor_id')) });
      adjunto_local_path = up.path;
      if (selectedPreference === 'supabase+drive') adjunto_drive_id = (await uploadToGoogleDriveStub(compressed, {})).driveFileId;
    }
    await createPedido({ sucursal_id: sucursalId, proveedor_id: String(form.get('proveedor_id')), fecha_pedido: String(form.get('fecha_pedido')), monto_estimado: Number(form.get('monto_estimado')), estado: String(form.get('estado')), notas: String(form.get('notas') || ''), datos_adicionales: String(form.get('datos_adicionales') || ''), adjunto_local_path, adjunto_drive_id, status_sync: 'synced' });
    setLoading(false); e.currentTarget.reset();
  };

  return <section className="space-y-4"><h2 className="text-2xl font-semibold">Pedidos</h2>
    <form onSubmit={(e)=>{e.preventDefault(); const f=new FormData(e.currentTarget); void createProveedor({nombre:String(f.get('nombre')),contacto:String(f.get('contacto')||'')}); e.currentTarget.reset();}} className="rounded-2xl bg-white p-4 shadow-sm flex gap-2"><input name="nombre" className="rounded border px-2 py-1" placeholder="Nuevo proveedor" required/><input name="contacto" className="rounded border px-2 py-1" placeholder="Contacto"/><button className="rounded bg-sky-600 px-3 py-1 text-white">Crear</button></form>
    <div className="rounded-2xl bg-white p-4 shadow-sm"><label>Estado: </label><select value={filtroEstado} onChange={(e)=>setFiltroEstado(e.target.value)} className="rounded border px-2 py-1"><option value="">Todos</option><option value="pendiente">Pendiente</option><option value="pagado">Pagado</option></select></div>
    <form onSubmit={onCreate} className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3"><select name="proveedor_id" required className="rounded border px-2 py-1"><option value="">Proveedor</option>{proveedores.map((p)=><option key={p.id} value={p.id}>{p.nombre}</option>)}</select><input type="date" name="fecha_pedido" required className="rounded border px-2 py-1"/><input type="number" name="monto_estimado" required className="rounded border px-2 py-1"/><select name="estado" className="rounded border px-2 py-1"><option value="pendiente">pendiente</option><option value="pagado">pagado</option></select><input name="notas" placeholder="Notas" className="rounded border px-2 py-1"/><textarea name="datos_adicionales" placeholder="Datos adicionales" className="rounded border px-2 py-1"/><select name="storage_preference" defaultValue={preference} className="rounded border px-2 py-1"><option value="supabase">Solo Supabase</option><option value="supabase+drive">Supabase + Drive</option><option value="ask">Preguntar</option></select><input name="adjunto" type="file" className="rounded border px-2 py-1"/><button disabled={loading} className="rounded bg-sky-700 px-3 py-2 text-white">{loading?'Guardando...':'Nuevo Pedido'}</button></form>
    <ul className="space-y-2">{filtered.map((p)=><li key={p.id} className="rounded-xl bg-white p-3 shadow-sm flex justify-between"><div>{p.proveedor_id} · {new Date(p.fecha_pedido).toLocaleDateString('es-CL')} · ${Number(p.monto_estimado).toLocaleString('es-CL')} · {p.estado} {p.adjunto_local_path?'📎':''} {p.status_sync}</div><button onClick={()=>void deletePedido(p.id)} className="text-red-600">Borrar</button></li>)}</ul>
    <ul className="space-y-1 text-sm">{proveedores.map((p)=><li key={p.id}>{p.nombre} <button className="text-red-600" onClick={()=>void deleteProveedor(p.id)}>x</button></li>)}</ul>
  </section>;
}
