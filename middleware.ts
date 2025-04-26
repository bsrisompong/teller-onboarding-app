import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from './features/auth';

const PATHS = {
  AUTH: {
    ROOT: '/auth',
    LOGIN: '/auth/login',
    TWO_FA: '/auth/2fa',
  },
  PROTECTED: {
    HOMEPAGE: '/',
  },
} as const;

const isAuthPath = (pathname: string) => pathname.startsWith('/auth');
const isRootAuthPath = (pathname: string) => pathname === PATHS.AUTH.ROOT;
const isTwoFAPath = (pathname: string) => pathname === PATHS.AUTH.TWO_FA;

const createRedirect = (request: NextRequest, path: string) =>
  NextResponse.redirect(new URL(path, request.url));

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // Handle root auth path redirect
  if (isRootAuthPath(pathname)) {
    return createRedirect(request, PATHS.AUTH.LOGIN);
  }

  // Handle unauthenticated access to protected routes
  if (!session && !isAuthPath(pathname)) {
    return createRedirect(request, PATHS.AUTH.LOGIN);
  }

  // Handle pending-2FA session
  if (session?.type === 'pending-2FA') {
    // If user is pending 2FA but not on 2FA page, redirect to 2FA
    if (!isTwoFAPath(pathname)) {
      return createRedirect(request, PATHS.AUTH.TWO_FA);
    }
    // If user is pending 2FA and on 2FA page, allow access
    return NextResponse.next();
  }

  // Handle authenticated session
  if (session?.type === 'authenticated') {
    // If authenticated user tries to access auth pages, redirect to HOMEPAGE
    if (isAuthPath(pathname)) {
      return createRedirect(request, PATHS.PROTECTED.HOMEPAGE);
    }
    // Allow access to protected routes
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - mockServiceWorker.js (MSW service worker)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)',
  ],
};
