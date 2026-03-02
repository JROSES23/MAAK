"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Wrench, Mail, Lock, ArrowRight, HardHat } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Credenciales incorrectas. Intenta de nuevo.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Error de conexion. Verifica tu red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Fondo degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1117] via-[#1a1c2e] to-[#1e2030]" />

      {/* Esferas decorativas difuminadas */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pastel-lilac/10 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-pastel-mint/8 blur-[80px]" />

      {/* Card principal con glassmorphism */}
      <div className="relative z-10 flex w-full max-w-4xl mx-4 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.04] shadow-2xl backdrop-blur-xl">
        {/* Panel lateral decorativo */}
        <div className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent p-10 border-r border-white/[0.06]">
          <div className="space-y-6 text-center">
            {/* Icono grande */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15 backdrop-blur-sm">
              <HardHat className="h-10 w-10 text-[var(--color-accent)]" />
            </div>

            {/* Ilustracion abstracta con iconos */}
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pastel-mint/10 backdrop-blur-sm">
                <Wrench className="h-7 w-7 text-pastel-mint" />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pastel-lilac/10 backdrop-blur-sm">
                <svg className="h-7 w-7 text-pastel-lilac" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m14 18 6-6-6-6" /><path d="M4 12h16" />
                </svg>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pastel-sky/10 backdrop-blur-sm">
                <svg className="h-7 w-7 text-pastel-sky" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                Gestion integral
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-[260px] mx-auto">
                Controla pedidos, remuneraciones, personal y presupuesto de todas tus sucursales desde un solo lugar.
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="flex flex-1 flex-col items-center justify-center p-8 sm:p-12">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)]/15">
              <Wrench className="h-6 w-6 text-[var(--color-accent)]" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
              MAAK
            </span>
          </div>

          <p className="mb-8 text-center text-sm text-[var(--color-text-secondary)]">
            Ingresa tus credenciales para acceder al sistema
          </p>

          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Correo electronico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maak.cl"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contrasena"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] py-3 text-sm font-semibold text-[var(--color-bg)] transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  Ingresar a MAAK
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-xs text-[var(--color-muted)]">
            Acceso restringido. Contacta al administrador si necesitas una cuenta.
          </p>
        </div>
      </div>
    </div>
  );
}
