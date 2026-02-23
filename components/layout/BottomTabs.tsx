'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

const tabs: { label: string; href: Route; icon: string }[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '▦' },
  { label: 'Pedidos', href: '/pedidos', icon: '🛒' },
  { label: 'Remuneraciones', href: '/remuneraciones', icon: '💳' },
  { label: 'Personal', href: '/personal', icon: '👤' }
];

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 w-[min(760px,95vw)] -translate-x-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur">
      <ul className="grid grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm ${
                  active ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
