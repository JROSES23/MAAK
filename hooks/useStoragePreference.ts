'use client';
import { useEffect, useState } from 'react';
import type { StoragePreference } from '@/lib/types';

const STORAGE_KEY = 'maak_storage_preference';

export function useStoragePreference() {
  const [preference, setPreferenceState] = useState<StoragePreference>('supabase');
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as StoragePreference | null;
    if (stored) setPreferenceState(stored);
  }, []);
  const setPreference = (next: StoragePreference) => {
    setPreferenceState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };
  return { preference, setPreference };
}
