import { ReactNode } from 'react';

export function SummaryCard({ title, value, tone = 'mint' }: { title: string; value: ReactNode; tone?: 'mint' | 'blue' | 'rose' | 'slate' }) {
  const tones = {
    mint: 'bg-emerald-100',
    blue: 'bg-sky-100',
    rose: 'bg-rose-100',
    slate: 'bg-slate-100'
  } as const;

  return (
    <article className={`rounded-2xl p-4 shadow-sm ${tones[tone]}`}>
      <h3 className="text-sm text-slate-600">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-slate-800">{value}</p>
    </article>
  );
}
