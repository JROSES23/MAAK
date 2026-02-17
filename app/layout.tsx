import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { PwaRegister } from '@/components/pwa-register';

export const metadata: Metadata = {
  title: 'MAAK Productivity',
  description: 'PWA de productividad premium estilo iOS con Supabase'
};

export const viewport: Viewport = {
  themeColor: '#0B0F1A'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="mx-auto max-w-md px-4 pb-8 pt-6 font-sans">
        <ThemeProvider><PwaRegister />{children}</ThemeProvider>
      </body>
    </html>
  );
}
