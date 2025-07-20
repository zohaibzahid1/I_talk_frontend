import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/auth/success'];

// Define protected routes that require authentication
const protectedRoutes = ['/', '/chat'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Check if the route is protected
  if (protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    // Get the token from cookies
    const accessToken = request.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      // No token found, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      // Validate the token by calling our API route
      const validationResponse = await fetch(`${request.nextUrl.origin}/api/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });
      
      const validationData = await validationResponse.json();
      
      if (!validationData.valid) {
        // Token is invalid, clear the cookies and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        // also clear local storage if needed
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        return response;
      }
      
      // Token is valid, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      console.error('Token validation error in middleware:', error);
      // On error, clear cookies and redirect to login for safety
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }
  }
  
  // Allow all other routes
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
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
