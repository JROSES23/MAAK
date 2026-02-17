'use client';

import { useMemo, useState } from 'react';

export default function ActivityPage() {
  const [duration, setDuration] = useState(100);
  const [breaks, setBreaks] = useState(4);
  const [breakDuration, setBreakDuration] = useState(5);

  const preview = useMemo(() => {
    const workBlocks = breaks + 1;
    const workMins = Math.max(5, Math.floor(duration / workBlocks));
    return `Work ${workMins}m × ${workBlocks} + Break ${breakDuration}m × ${breaks}`;
  }, [duration, breaks, breakDuration]);

  return (
    <main className="space-y-4">
      <header className="squircle p-5"><h1 className="text-xl font-semibold">Crear / Editar Actividad</h1></header>
      <form className="squircle space-y-3 p-5">
        <input className="w-full rounded-2xl border border-white/15 bg-black/10 p-3" placeholder="Título" required />
        <input className="w-full rounded-2xl border border-white/15 bg-black/10 p-3" placeholder="Categoría" required />
        <input type="date" className="w-full rounded-2xl border border-white/15 bg-black/10 p-3" required />
        <input type="time" className="w-full rounded-2xl border border-white/15 bg-black/10 p-3" required />
        <label className="text-sm">Duración total (máx 120 min): {duration}</label>
        <input type="range" min={10} max={120} value={duration} onChange={(e)=>setDuration(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
        <label className="text-sm">breaks_count (0-10): {breaks}</label>
        <input type="range" min={0} max={10} value={breaks} onChange={(e)=>setBreaks(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
        <label className="text-sm">break_duration (1-15): {breakDuration}</label>
        <input type="range" min={1} max={15} value={breakDuration} onChange={(e)=>setBreakDuration(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
        <p className="rounded-2xl bg-black/10 p-3 text-sm">{preview}</p>
      </form>
    </main>
  );
}
