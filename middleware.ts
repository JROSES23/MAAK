import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Protege todas las rutas excepto:
     * - _next/static, _next/image (archivos estáticos de Next.js)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Archivos públicos con extensión (imágenes, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
