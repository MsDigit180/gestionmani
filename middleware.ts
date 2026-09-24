import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Récupérer le cookie d'authentification
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Si l'utilisateur n'est pas connecté et tente d'accéder à une page protégée
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Si l'utilisateur est connecté et tente d'accéder à /login, le rediriger vers le dashboard
  if (token && pathname === '/login') {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Matcher mis à jour pour PWA :
     * Exclut :
     * - api routes
     * - _next/static & _next/image
     * - favicon.ico
     * - manifest.json & manifest.webmanifest
     * - sw.js & workbox-*.js (fichiers générés par Serwist)
     * - le dossier icons/ ou les fichiers images png/svg/jpg
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest\.json|manifest\.webmanifest|sw\.js|workbox-.*|icons/.*|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)',
  ],
};