# MAAK Productivity PWA

App móvil premium de productividad en Next.js 14 + Supabase con modo **Crystal** y **Dark profundo**.

## Stack
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- Zustand (estado global UI)
- PWA (manifest + service worker)

## Variables de entorno
Crear `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Setup local
```bash
npm install
npm run dev
```

## SQL + RLS
Ejecuta `sql/supabase-schema.sql` en el SQL Editor de Supabase.

Incluye tablas:
- profiles
- tasks
- flashcards
- folders
- files

Con RLS en todas las tablas y políticas `auth.uid() = user_id` (o `id` en profiles).

## Deploy en Vercel
1. Importa el repo en Vercel.
2. Configura variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Build command: `npm run build`
4. Output: `.next`
5. Deploy.

## Pantallas implementadas
- Splash
- Login
- Registro
- Reset contraseña
- Home
- Vista Día (timeline)
- Crear/Editar Actividad
- Focus Session
- Flashcards
- Notas/Carpetas
- Ajustes (modo + paletas)
