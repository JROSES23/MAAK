'use client';

import Link from 'next/link';
import { SectionCard } from '@/components/section-card';
import { useSession } from '@/hooks/use-session';

const todayTasks = ['Trotar – 30 min', 'M1 PAES – 45 min', 'Proyecto SaaS – 60 min'];

export default function HomePage() {
  const { email } = useSession();
  return (
    <main className="space-y-4">
      <header className="squircle flex items-center justify-between p-5">
        <div>
          <p className="text-muted">Buenas noches,</p>
          <p className="text-2xl font-semibold">{email?.split('@')[0] ?? 'Renato'}</p>
        </div>
        <Link href="/app/settings" className="h-10 w-10 rounded-full bg-white/10" aria-label="settings" />
      </header>

      <input className="squircle w-full p-4 text-sm placeholder:text-slate-200/60" placeholder="Buscar tareas, notas o flashcards" />

      <SectionCard title="Hoy">
        <div className="flex snap-x gap-3 overflow-x-auto pb-1">
          {todayTasks.map((task) => (
            <article key={task} className="min-w-[220px] rounded-3xl border border-white/15 bg-black/10 p-4">
              {task}
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Progreso">
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4" style={{ borderColor: 'var(--accent)' }}>
            <span className="text-xl font-semibold">92%</span>
          </div>
          <div className="space-y-1 text-sm">
            <p>92% completado</p>
            <p className="text-muted">4 tareas</p>
            <p className="text-muted">2h 10m foco</p>
            <p className="text-muted">1 flashcard pendiente</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Semana">
        <div className="flex justify-between text-sm">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
            <div key={d} className={`rounded-full px-3 py-2 ${i === 2 ? 'bg-white/20' : 'bg-black/10'}`}>{d}</div>
          ))}
        </div>
      </SectionCard>
    </main>
  );
}
