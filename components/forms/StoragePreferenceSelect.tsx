'use client';

import type { StoragePreference } from '@/lib/types';

export function StoragePreferenceSelect({ value, onChange, id = 'storagePreference' }: { value: StoragePreference; onChange: (value: StoragePreference) => void; id?: string }) {
  return (
    <label htmlFor={id} className="block text-sm text-slate-600">
      Estrategia de adjuntos
      <select id={id} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={value} onChange={(event) => onChange(event.target.value as StoragePreference)}>
        <option value="supabase">Solo Supabase Storage</option>
        <option value="supabase+drive">Supabase + Google Drive</option>
        <option value="ask">Preguntar cada vez</option>
      </select>
    </label>
  );
}
