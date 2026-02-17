import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith('/app')) return NextResponse.next();

  const hasSession = request.cookies.getAll().some((cookie) => cookie.name.includes('sb-') && cookie.name.endsWith('-auth-token'));
  if (!hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*']
};
