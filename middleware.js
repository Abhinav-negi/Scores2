import { NextResponse } from 'next/server';
import { verifyTokenEdge } from './lib/auth/jwt';

// Define protected routes
const protectedRoutes = ['/dashboard', '/tracker', '/results', '/settings'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  // If it's the root path, we'll redirect to dashboard if authed, or login if not
  if (pathname === '/') {
    const token = request.cookies.get('token')?.value;
    if (token) {
      const payload = await verifyTokenEdge(token);
      if (payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isProtected) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // No token, redirect to login
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }

    // Verify token
    const payload = await verifyTokenEdge(token);
    
    if (!payload) {
      // Invalid token, redirect to login
      const url = new URL('/login', request.url);
      // Optional: Clear the invalid cookie
      const response = NextResponse.redirect(url);
      response.cookies.delete('token');
      return response;
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  // Apply middleware to these routes
  // Exclude api routes, static files, next internals, etc.
  matcher: [
    '/',
    '/dashboard/:path*',
    '/tracker/:path*',
    '/results/:path*',
    '/settings/:path*'
  ],
};
