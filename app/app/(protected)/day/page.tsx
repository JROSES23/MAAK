const slots = [
  { time: '8:00', title: 'Morning run', color: '#4BB58B' },
  { time: '9:00', title: 'Flashcard: Derivadas', color: '#7EA4FF' },
  { time: '10:00', title: 'Deep Work', color: '#A48CFF' }
];

export default function DayPage() {
  return (
    <main className="space-y-4">
      <header className="squircle p-5 text-center">
        <p className="text-sm text-muted">Vista Día</p>
        <h1 className="text-2xl font-semibold">Miércoles 12 junio</h1>
      </header>
      <div className="squircle flex gap-2 overflow-x-auto p-3 text-sm">
        {['10', '11', '12', '13', '14', '15', '16'].map((d)=> <span key={d} className="rounded-full bg-black/10 px-3 py-1">{d}</span>)}
      </div>
      <section className="squircle p-4">
        <div className="space-y-3">
          {slots.map((slot) => (
            <article key={slot.time} className="flex gap-3 rounded-3xl border border-white/10 bg-black/10 p-3">
              <p className="w-12 text-sm text-muted">{slot.time}</p>
              <div className="w-1 rounded-full" style={{ background: slot.color }} />
              <p>{slot.title}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
