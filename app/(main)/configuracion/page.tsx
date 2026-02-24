'use client';
import { useStoragePreference } from '@/hooks/useStoragePreference';

export default function ConfiguracionPage() {
  const { preference, setPreference } = useStoragePreference();
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Configuración</h2>
      <p className="mb-4 text-sm text-slate-600">Preferencia global de almacenamiento de adjuntos.</p>
      <select value={preference} onChange={(e) => setPreference(e.target.value as typeof preference)} className="rounded-lg border px-3 py-2">
        <option value="supabase">Solo Supabase Storage</option>
        <option value="supabase+drive">Supabase + Google Drive</option>
        <option value="ask">Preguntar cada vez</option>
      </select>
    </section>
  );
}
