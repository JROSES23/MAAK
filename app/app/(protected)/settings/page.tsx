'use client';

import { palettes } from '@/lib/theme';
import { useUiStore } from '@/store/ui-store';

export default function SettingsPage() {
  const { mode, palette, setMode, setPalette } = useUiStore();

  return (
    <main className="space-y-4">
      <header className="squircle p-5"><h1 className="text-xl font-semibold">Ajustes visuales</h1></header>
      <section className="squircle space-y-3 p-5">
        <p className="text-sm text-muted">Modo visual</p>
        <div className="flex gap-2">
          <button onClick={() => setMode('crystal')} className={`rounded-2xl px-4 py-2 ${mode==='crystal' ? 'bg-white/25' : 'bg-black/10'}`}>Crystal</button>
          <button onClick={() => setMode('dark')} className={`rounded-2xl px-4 py-2 ${mode==='dark' ? 'bg-white/25' : 'bg-black/10'}`}>Dark profundo</button>
        </div>
      </section>
      <section className="squircle p-5">
        <p className="text-sm text-muted">Combinación de color</p>
        <div className="mt-3 grid grid-cols-1 gap-2">
          {Object.keys(palettes).map((key) => (
            <button key={key} onClick={() => setPalette(key as keyof typeof palettes)} className={`rounded-2xl border border-white/10 p-3 text-left ${palette===key ? 'bg-white/20' : 'bg-black/10'}`}>
              {key}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
