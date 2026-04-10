import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Global protection proxy (Next.js 16+ convention).
 * Replaces the deprecated middleware.ts.
 * @security-auditor
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session/cookie (Real integration will use Supabase Auth)
  const session = request.cookies.get('vpcn_session');

  const isPublicRoute = pathname.startsWith('/public');

  if (!session && !isPublicRoute && pathname !== '/') {
    // Secure redirect to centralized vpsistema login
    const loginUrl = new URL('/vpsistema/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Protected paths configuration.
 */
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/solicitacoes/:path*', 
    '/produtos/:path*',
    '/config/:path*',
  ],
};
