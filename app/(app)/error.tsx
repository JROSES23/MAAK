"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for debugging (remove in production or send to error service)
    console.error("[MAAK Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-6 px-4 max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-[var(--color-text)]">
            Algo salio mal
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Ocurrio un error inesperado. Intenta recargar la pagina.
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)] hover:opacity-90 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
