export default function NotesPage() {
  return (
    <main className="space-y-4">
      <header className="squircle p-5"><h1 className="text-xl font-semibold">Notas / Carpetas</h1></header>
      <section className="squircle p-5">
        <div className="grid grid-cols-2 gap-3">
          {['PAES', 'SaaS', 'Salud', 'Ideas'].map((folder) => (
            <article key={folder} className="rounded-3xl border border-white/10 bg-black/10 p-4">
              <p className="font-medium">{folder}</p>
              <p className="text-sm text-muted">3 archivos</p>
            </article>
          ))}
        </div>
        <textarea className="mt-4 h-32 w-full rounded-2xl border border-white/15 bg-black/10 p-3" maxLength={1500} placeholder="Autosave note..." />
      </section>
    </main>
  );
}
