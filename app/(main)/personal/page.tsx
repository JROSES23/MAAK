'use client';
import { FormEvent, useMemo, useState } from 'react';
import { useCategoriasPersonales } from '@/hooks/useCategoriasPersonales';
import { useGastosPersonales } from '@/hooks/useGastosPersonales';
import { useStoragePreference } from '@/hooks/useStoragePreference';
import { compressBeforeUpload, uploadToGoogleDriveStub, uploadToSupabaseStorage } from '@/lib/files';
import { USER_ID_DEMO } from '@/lib/types';
import type { StoragePreference } from '@/lib/types';

export default function PersonalPage() {
  const { categorias, createCategoria, deleteCategoria } = useCategoriasPersonales(USER_ID_DEMO);
  const { gastos, createGasto, deleteGasto } = useGastosPersonales(USER_ID_DEMO);
  const { preference } = useStoragePreference();
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const filtered = useMemo(() => gastos.filter((g) => !categoriaFilter || g.categoria_id === categoriaFilter), [gastos, categoriaFilter]);
  const totalMes = filtered.reduce((a, g) => a + Number(g.monto), 0);

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const pref = (form.get('storage_preference') as StoragePreference) || preference;
    const file = form.get('adjunto') as File;
    let adjunto_local_path: string | null = null; let adjunto_drive_id: string | null = null;
    if (file?.size) {
      const c = await compressBeforeUpload(file);
      adjunto_local_path = (await uploadToSupabaseStorage(c, { tipo: 'gasto', userId: USER_ID_DEMO, categoriaId: String(form.get('categoria_id')) })).path;
      if (pref === 'supabase+drive') adjunto_drive_id = (await uploadToGoogleDriveStub(c, {})).driveFileId;
    }
    await createGasto({ user_id: USER_ID_DEMO, categoria_id: String(form.get('categoria_id')), monto: Number(form.get('monto')), fecha: String(form.get('fecha')), descripcion: String(form.get('descripcion') || ''), datos_adicionales: String(form.get('datos_adicionales') || ''), adjunto_local_path, adjunto_drive_id, status_sync: 'synced' });
    e.currentTarget.reset();
  };

  return <section className="space-y-4"><h2 className="text-2xl font-semibold">Personal</h2>
    <article className="rounded-2xl bg-white p-4 shadow-sm">Total actual: <span className="font-semibold">${totalMes.toLocaleString('es-CL')}</span></article>
    <form onSubmit={(e)=>{e.preventDefault();const f=new FormData(e.currentTarget);void createCategoria(String(f.get('nombre')));e.currentTarget.reset();}} className="rounded-2xl bg-white p-4 shadow-sm flex gap-2"><input name="nombre" required className="rounded border px-2 py-1" placeholder="Nueva categoría"/><button className="rounded bg-rose-600 px-3 py-1 text-white">Crear</button></form>
    <select className="rounded border px-2 py-1" value={categoriaFilter} onChange={(e)=>setCategoriaFilter(e.target.value)}><option value="">Todas</option>{categorias.map((c)=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select>
    <form onSubmit={onCreate} className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3"><select name="categoria_id" required className="rounded border px-2 py-1"><option value="">Categoría</option>{categorias.map((c)=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select><input type="number" name="monto" required className="rounded border px-2 py-1"/><input type="date" name="fecha" required className="rounded border px-2 py-1"/><input name="descripcion" className="rounded border px-2 py-1" placeholder="Descripción"/><textarea name="datos_adicionales" className="rounded border px-2 py-1" placeholder="Datos adicionales"/><select name="storage_preference" defaultValue={preference} className="rounded border px-2 py-1"><option value="supabase">Solo Supabase</option><option value="supabase+drive">Supabase + Drive</option><option value="ask">Preguntar</option></select><input type="file" name="adjunto" className="rounded border px-2 py-1"/><button className="rounded bg-rose-700 px-3 py-2 text-white">Nuevo gasto</button></form>
    <ul className="space-y-2">{filtered.map((g)=><li key={g.id} className="rounded-xl bg-white p-3 shadow-sm flex justify-between"><div>{new Date(g.fecha).toLocaleDateString('es-CL')} · ${Number(g.monto).toLocaleString('es-CL')} · {g.descripcion}</div><button className="text-red-600" onClick={()=>void deleteGasto(g.id)}>Borrar</button></li>)}</ul>
    <ul className="text-sm">{categorias.map((c)=><li key={c.id}>{c.nombre} <button className="text-red-600" onClick={()=>void deleteCategoria(c.id)}>x</button></li>)}</ul>
  </section>;
}
