'use client';

import { useEffect, useState } from 'react';
import type { StoragePreference } from '@/lib/storage/files';

const STORAGE_KEY = 'gestionpyme_storage_preference';

export function useStoragePreference() {
  const [preference, setPreferenceState] = useState<StoragePreference>('supabase');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as StoragePreference | null;
    if (stored) setPreferenceState(stored);
  }, []);

  const setPreference = (value: StoragePreference) => {
    setPreferenceState(value);
    window.localStorage.setItem(STORAGE_KEY, value);
  };

  return { preference, setPreference };
}
