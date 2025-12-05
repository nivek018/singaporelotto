import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Protect /encode/dashboard
    if (request.nextUrl.pathname.startsWith('/encode/dashboard')) {
        const adminSession = request.cookies.get('admin_session');

        if (!adminSession) {
            return NextResponse.redirect(new URL('/encode', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/encode/dashboard/:path*',
};
