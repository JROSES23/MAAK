'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pedidos', label: 'Pedidos' },
  { href: '/remuneraciones', label: 'Remuneraciones' },
  { href: '/personal', label: 'Personal' },
  { href: '/configuracion', label: 'Configuración' }
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-4 left-1/2 z-20 w-[95%] max-w-xl -translate-x-1/2 rounded-full border bg-white/90 p-2 shadow-lg backdrop-blur md:static md:w-auto md:max-w-none md:translate-x-0 md:rounded-2xl">
      <ul className="flex items-center justify-between gap-1 md:justify-start">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={`block rounded-full px-3 py-2 text-sm ${pathname === item.href ? 'bg-sky-100 text-sky-700' : 'text-slate-600'}`}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
