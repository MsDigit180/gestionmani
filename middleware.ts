import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // ✅ Importation corrigée ici

export function middleware(request: NextRequest) {
  // 1. Récupérer le cookie d'authentification
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Si l'utilisateur n'est pas connecté et tente d'accéder à une page protégée
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Si l'utilisateur est déjà connecté et tente d'aller sur /login
  

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Exclure les fichiers statiques, images, favicon et API
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};