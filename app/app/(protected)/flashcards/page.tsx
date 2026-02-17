export default function FlashcardsPage() {
  return (
    <main className="space-y-4">
      <header className="squircle p-5"><h1 className="text-xl font-semibold">Flashcards programadas</h1></header>
      <section className="squircle space-y-3 p-5">
        <article className="rounded-3xl border border-white/10 bg-black/10 p-4">
          <p className="text-sm text-muted">Hoy 19:30</p>
          <p className="mt-1">Derivadas: regla de la cadena + ejemplos.</p>
          <p className="mt-2 text-xs text-muted">Pendiente en timeline</p>
        </article>
      </section>
    </main>
  );
}
