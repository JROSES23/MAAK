'use client';
import { useEffect, useState } from 'react';

const KEY = 'maak_current_sucursal';
export function useCurrentSucursal() {
  const [sucursalId, setId] = useState('');
  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    if (saved) setId(saved);
  }, []);
  const setSucursalId = (id: string) => {
    setId(id);
    window.localStorage.setItem(KEY, id);
  };
  return { sucursalId, setSucursalId };
}
