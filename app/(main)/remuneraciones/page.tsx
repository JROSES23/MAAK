'use client';
import { FormEvent, useMemo, useState } from 'react';
import { useCurrentSucursal } from '@/hooks/useCurrentSucursal';
import { useRemuneraciones } from '@/hooks/useRemuneraciones';
import { useStoragePreference } from '@/hooks/useStoragePreference';
import { useTrabajadores } from '@/hooks/useTrabajadores';
import { compressBeforeUpload, uploadToGoogleDriveStub, uploadToSupabaseStorage } from '@/lib/files';
import type { StoragePreference } from '@/lib/types';

export default function RemuneracionesPage() {
  const { sucursalId } = useCurrentSucursal();
  const { trabajadores, createTrabajador, deleteTrabajador } = useTrabajadores(sucursalId);
  const { remuneraciones, createRemuneracion, deleteRemuneracion } = useRemuneraciones(sucursalId);
  const { preference } = useStoragePreference();
  const [soloQuincena, setSoloQuincena] = useState(false);
  const items = useMemo(() => remuneraciones.filter((r) => (soloQuincena ? r.es_quincena : true)), [remuneraciones, soloQuincena]);

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const pref = (form.get('storage_preference') as StoragePreference) || preference;
    const file = form.get('adjunto') as File;
    let adjunto_local_path: string | null = null; let adjunto_drive_id: string | null = null;
    if (file?.size) {
      const c = await compressBeforeUpload(file);
      adjunto_local_path = (await uploadToSupabaseStorage(c, { tipo: 'remuneracion', sucursalId, trabajadorId: String(form.get('trabajador_id')) })).path;
      if (pref === 'supabase+drive') adjunto_drive_id = (await uploadToGoogleDriveStub(c, {})).driveFileId;
    }
    await createRemuneracion({ trabajador_id: String(form.get('trabajador_id')), fecha_pago: String(form.get('fecha_pago')), sueldo_base: Number(form.get('sueldo_base')), bonos: Number(form.get('bonos') || 0), es_quincena: Boolean(form.get('es_quincena')), datos_adicionales: String(form.get('datos_adicionales') || ''), adjunto_local_path, adjunto_drive_id, status_sync: 'synced' });
    e.currentTarget.reset();
  };

  return <section className="space-y-4"><h2 className="text-2xl font-semibold">Remuneraciones</h2>
  <form onSubmit={(e)=>{e.preventDefault(); const f=new FormData(e.currentTarget); void createTrabajador({nombre:String(f.get('nombre')),rut:String(f.get('rut')||''),sucursal_id:sucursalId}); e.currentTarget.reset();}} className="rounded-2xl bg-white p-4 shadow-sm flex gap-2"><input name="nombre" required placeholder="Trabajador" className="rounded border px-2 py-1"/><input name="rut" placeholder="RUT" className="rounded border px-2 py-1"/><button className="rounded bg-emerald-600 px-3 py-1 text-white">Crear</button></form>
  <label className="text-sm"><input type="checkbox" checked={soloQuincena} onChange={(e)=>setSoloQuincena(e.target.checked)} /> Solo quincenas</label>
  <form onSubmit={onCreate} className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3"><select name="trabajador_id" required className="rounded border px-2 py-1"><option value="">Trabajador</option>{trabajadores.map((t)=><option key={t.id} value={t.id}>{t.nombre}</option>)}</select><input type="date" name="fecha_pago" className="rounded border px-2 py-1" required/><input type="number" name="sueldo_base" className="rounded border px-2 py-1" required/><input type="number" name="bonos" defaultValue={0} className="rounded border px-2 py-1"/><label><input type="checkbox" name="es_quincena"/> Es quincena</label><textarea name="datos_adicionales" className="rounded border px-2 py-1"/><select name="storage_preference" defaultValue={preference} className="rounded border px-2 py-1"><option value="supabase">Solo Supabase</option><option value="supabase+drive">Supabase + Drive</option><option value="ask">Preguntar</option></select><input type="file" name="adjunto" className="rounded border px-2 py-1"/><button className="rounded bg-emerald-700 px-3 py-2 text-white">Nueva remuneración</button></form>
  <ul className="space-y-2">{items.map((r)=><li key={r.id} className="rounded-xl bg-white p-3 shadow-sm flex justify-between"><div>{r.trabajadores?.nombre ?? r.trabajador_id} · {new Date(r.fecha_pago).toLocaleDateString('es-CL')} · ${(Number(r.sueldo_base)+Number(r.bonos||0)).toLocaleString('es-CL')} {r.es_quincena?'· quincena':''}</div><button className="text-red-600" onClick={()=>void deleteRemuneracion(r.id)}>Borrar</button></li>)}</ul>
  <ul className="text-sm">{trabajadores.map((t)=><li key={t.id}>{t.nombre} <button className="text-red-600" onClick={()=>void deleteTrabajador(t.id)}>x</button></li>)}</ul>
  </section>;
}
