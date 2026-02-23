# GestiónPYME PWA

Aplicación PWA para tablets Android orientada a gestión de PYMEs: pedidos a proveedores, remuneraciones y gastos personales, con integración a Supabase y soporte opcional de Google Drive.

## Ejecutar local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=TU_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=TU_GOOGLE_CLIENT_ID
   ```
3. Levantar entorno:
   ```bash
   npm run dev
   ```

## Estructura clave

- `app/(tabs)/dashboard/page.tsx`
- `app/(tabs)/pedidos/page.tsx`
- `app/(tabs)/remuneraciones/page.tsx`
- `app/(tabs)/personal/page.tsx`
- `lib/supabase/client.ts`
- `lib/storage/files.ts`
- `lib/drive/upload.ts`
- `public/manifest.json`
- `public/sw.js`
