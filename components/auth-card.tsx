'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth';

type Variant = 'login' | 'register' | 'reset';

export function AuthCard({ variant }: { variant: Variant }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Procesando...');
    if (variant === 'login') {
      const { error } = await authClient.signIn(email, password);
      setMessage(error?.message ?? 'Bienvenido de vuelta');
      if (!error) router.push('/app/home');
      return;
    }
    if (variant === 'register') {
      const { error } = await authClient.signUp(email, password);
      setMessage(error?.message ?? 'Revisa tu correo para confirmar la cuenta');
      return;
    }
    const { error } = await authClient.resetPassword(email);
    setMessage(error?.message ?? 'Te enviamos un enlace de recuperación');
  };

  return (
    <section className="squircle mt-6 p-6">
      <h1 className="text-2xl font-semibold">
        {variant === 'login' ? 'Inicia sesión' : variant === 'register' ? 'Crear cuenta' : 'Recuperar contraseña'}
      </h1>
      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-2xl border border-white/15 bg-black/10 p-3" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        {variant !== 'reset' && (
          <input className="w-full rounded-2xl border border-white/15 bg-black/10 p-3" placeholder="Contraseña" type="password" minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} required />
        )}
        <button className="w-full rounded-2xl p-3 font-medium text-slate-50" style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }}>
          {variant === 'login' ? 'Entrar' : variant === 'register' ? 'Registrarme' : 'Enviar enlace'}
        </button>
      </form>
      <p className="mt-3 text-sm text-muted">{message}</p>
      <div className="mt-4 flex gap-3 text-sm text-muted">
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Registro</Link>
        <Link href="/auth/reset">Reset</Link>
      </div>
    </section>
  );
}
