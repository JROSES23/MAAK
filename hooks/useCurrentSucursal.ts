'use client';

import { useEffect, useState } from 'react';

const CURRENT_SUCURSAL_KEY = 'gestionpyme_current_sucursal';

export function useCurrentSucursal() {
  const [sucursalId, setSucursalId] = useState<string>('');

  useEffect(() => {
    const stored = window.localStorage.getItem(CURRENT_SUCURSAL_KEY);
    if (stored) setSucursalId(stored);
  }, []);

  const updateSucursal = (nextSucursalId: string) => {
    setSucursalId(nextSucursalId);
    window.localStorage.setItem(CURRENT_SUCURSAL_KEY, nextSucursalId);
  };

  return { sucursalId, setSucursalId: updateSucursal };
}
