import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from './features/auth';
import { SessionType } from './features/auth/types';

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

// Normalize path by removing trailing slash
const normalizePath = (path: string) => path.replace(/\/$/, '');

const isAuthPath = (pathname: string) => pathname.startsWith('/auth');
const isRootAuthPath = (pathname: string) => normalizePath(pathname) === PATHS.AUTH.ROOT;
const isTwoFAPath = (pathname: string) => normalizePath(pathname) === PATHS.AUTH.TWO_FA;
const isLoginPath = (pathname: string) => normalizePath(pathname) === PATHS.AUTH.LOGIN;

// Validate if the path is a valid auth path
const isValidAuthPath = (pathname: string) => {
  const validAuthPaths: (typeof PATHS.AUTH.LOGIN | typeof PATHS.AUTH.TWO_FA)[] = [
    PATHS.AUTH.LOGIN,
    PATHS.AUTH.TWO_FA,
  ];
  return validAuthPaths.includes(
    normalizePath(pathname) as typeof PATHS.AUTH.LOGIN | typeof PATHS.AUTH.TWO_FA
  );
};

const createRedirect = (request: NextRequest, path: string) => {
  try {
    return NextResponse.redirect(new URL(path, request.url));
  } catch (error) {
    console.error('Invalid URL construction:', error);
    // Fallback to default URL if request.url is malformed
    return NextResponse.redirect(new URL(path, 'http://localhost:3000'));
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // Get session first to handle all auth states
    const session = await getSession();

    // Handle root auth path redirect
    if (isRootAuthPath(pathname)) {
      return createRedirect(request, PATHS.AUTH.LOGIN);
    }

    // Handle unauthenticated access
    if (!session) {
      // If trying to access /auth/2fa without a session, redirect to login
      if (isTwoFAPath(pathname)) {
        return createRedirect(request, PATHS.AUTH.LOGIN);
      }
      // If trying to access invalid auth path, redirect to login
      if (isAuthPath(pathname) && !isValidAuthPath(pathname)) {
        return createRedirect(request, PATHS.AUTH.LOGIN);
      }
      // If trying to access protected route, redirect to login with return url
      if (!isAuthPath(pathname)) {
        const url = new URL(PATHS.AUTH.LOGIN, request.url);
        url.searchParams.set('redirect', encodeURIComponent(pathname));
        return NextResponse.redirect(url);
      }
      // Allow access to valid auth paths
      return NextResponse.next();
    }

    // Handle 2FA setup/verification session
    if (session?.type === SessionType.SETUP_2FA || session?.type === SessionType.VERIFY_2FA) {
      // If user is in 2FA flow but not on 2FA page, redirect to 2FA
      if (!isTwoFAPath(pathname)) {
        return createRedirect(request, PATHS.AUTH.TWO_FA);
      }
      // If user is in 2FA flow and on 2FA page, allow access
      return NextResponse.next();
    }

    // Handle fully authenticated session
    if (session?.type === SessionType.FULL_ACCESS) {
      // If authenticated user tries to access auth pages, redirect to HOMEPAGE
      if (isAuthPath(pathname)) {
        return createRedirect(request, PATHS.PROTECTED.HOMEPAGE);
      }
      // Allow access to protected routes
      return NextResponse.next();
    }

    // Handle invalid session type
    console.error('Invalid session type:', session?.type);
    return createRedirect(request, PATHS.AUTH.LOGIN);
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login
    return createRedirect(request, PATHS.AUTH.LOGIN);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - mockServiceWorker.js (mock service worker file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)',
  ],
};
