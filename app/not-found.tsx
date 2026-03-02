"use client";

import Link from "next/link";
import { Wrench, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center space-y-6 px-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15">
          <Wrench className="h-8 w-8 text-[var(--color-accent)]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[var(--color-text)]">404</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Pagina no encontrada
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)] hover:opacity-90 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
