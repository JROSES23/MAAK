"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Wrench, Mail, Lock, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo con blur */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: "url('/images/login-bg.jpg')",
          filter: "blur(6px)",
        }}
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 z-10 bg-black/55" />

      {/* Card de login centrado */}
      <div className="relative z-20 w-full max-w-[400px] mx-4">
        <div className="rounded-3xl border border-white/[0.12] bg-white/[0.08] p-8 shadow-2xl backdrop-blur-[20px]">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Wrench className="h-6 w-6 text-[#f4a7bb]" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">
              MAAK
            </span>
          </div>

          <p className="mb-8 text-center text-sm text-white/60">
            Ingresa tus credenciales para acceder al sistema
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">
                Correo electronico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maak.cl"
                  required
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.06] py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#f4a7bb] focus:outline-none focus:ring-1 focus:ring-[#f4a7bb]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">
                Contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contrasena"
                  required
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.06] py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#f4a7bb] focus:outline-none focus:ring-1 focus:ring-[#f4a7bb]"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-500/15 px-4 py-2.5 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f4a7bb] to-[#c3a6d8] py-3 text-sm font-semibold text-[#0f1117] transition-all hover:opacity-90 disabled:opacity-50"
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

          <p className="mt-8 text-center text-xs text-white/30">
            Sistema de uso privado — Powered by MAAK
          </p>
        </div>
      </div>
    </div>
  );
}
