'use client';

import { useEffect } from 'react';
import { palettes } from '@/lib/theme';
import { useUiStore } from '@/store/ui-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useUiStore((s) => s.mode);
  const palette = useUiStore((s) => s.palette);

  useEffect(() => {
    const root = document.documentElement;
    const colors = palettes[palette];
    root.setAttribute('data-mode', mode);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-2', colors.accent2);
    if (mode === 'crystal') {
      root.style.setProperty('--bg-1', colors.bg1);
      root.style.setProperty('--bg-2', colors.bg2);
    } else {
      root.style.setProperty('--bg-1', '#0B0F1A');
      root.style.setProperty('--bg-2', '#0F172A');
    }
    document.body.classList.toggle('dark', mode === 'dark');
  }, [mode, palette]);

  return <>{children}</>;
}
