import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect dashboard routes and task API routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/tasks')) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, encodedSecret);
      
      // Pass the user ID to API routes via headers
      if (pathname.startsWith('/api/tasks')) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.id as string);
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }
      
      return NextResponse.next();
    } catch (error) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Prevent logged-in users from accessing login/register pages
  if (pathname === '/login' || pathname === '/register') {
    const token = request.cookies.get('authToken')?.value;
    if (token) {
      try {
        await jwtVerify(token, encodedSecret);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        // Token invalid, allow them to view login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/tasks/:path*', '/login', '/register'],
};
