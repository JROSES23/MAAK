'use client';

import { StoragePreferenceSelect } from '@/components/forms/StoragePreferenceSelect';
import { useStoragePreference } from '@/hooks/useStoragePreference';

export default function ConfiguracionPage() {
  const { preference, setPreference } = useStoragePreference();

  return (
    <section className="mx-auto mt-4 max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Configuración de almacenamiento</h1>
      <p className="mt-2 text-sm text-slate-600">Define si los adjuntos se guardan solo en Supabase o también en Google Drive.</p>
      <div className="mt-4">
        <StoragePreferenceSelect value={preference} onChange={setPreference} />
      </div>
    </section>
  );
}
