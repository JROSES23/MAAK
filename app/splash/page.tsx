import Link from 'next/link';

export default function SplashPage() {
  return (
    <main className="flex min-h-[85vh] flex-col items-center justify-center gap-6 text-center">
      <div className="squircle p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">MAAK</p>
        <h1 className="mt-3 text-3xl font-semibold">Productividad con elegancia</h1>
        <p className="mt-2 text-muted">PWA móvil con ritmo diario, enfoque profundo y diseño premium.</p>
      </div>
      <Link href="/auth/login" className="rounded-full px-6 py-3 font-semibold text-slate-50" style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }}>
        Empezar
      </Link>
    </main>
  );
}
