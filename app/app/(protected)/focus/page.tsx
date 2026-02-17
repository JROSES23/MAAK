export default function FocusPage() {
  return (
    <main className="space-y-4">
      <header className="squircle p-5 text-center">
        <h1 className="text-xl font-semibold">Focus Session</h1>
      </header>
      <section className="squircle flex min-h-72 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-muted">Fase actual: Trabajo</p>
        <div className="text-6xl font-semibold">24:52</div>
        <p className="text-sm text-muted">Animación: Núcleo energético minimal</p>
        <div className="mt-4 flex gap-2">
          <button className="rounded-2xl bg-black/20 px-4 py-2">Pausar</button>
          <button className="rounded-2xl bg-black/20 px-4 py-2">Saltar pausa</button>
          <button className="rounded-2xl bg-black/20 px-4 py-2">Terminar</button>
        </div>
      </section>
    </main>
  );
}
