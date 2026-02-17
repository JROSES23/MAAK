'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/app/home', label: 'Home' },
  { href: '/app/day', label: 'Día' },
  { href: '/app/focus', label: 'Focus' },
  { href: '/app/flashcards', label: 'Cards' },
  { href: '/app/notes', label: 'Notas' }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-4 left-1/2 w-[92%] max-w-md -translate-x-1/2 squircle px-4 py-3">
      <nav className="flex items-center justify-between text-xs">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={pathname === item.href ? 'font-semibold' : 'text-muted'}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link href="/app/activity" className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full text-2xl text-white shadow-soft" style={{ background: 'linear-gradient(145deg,var(--accent),var(--accent-2))' }}>
        +
      </Link>
    </footer>
  );
}
