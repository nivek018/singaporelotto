import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

// Validate session token against current password
function isValidSession(token: string, password: string): boolean {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const parts = decoded.split(':');
        if (parts.length !== 3) return false;

        const [passwordHash, timestamp, signature] = parts;

        // Verify the password hash matches current password
        const currentPasswordHash = crypto.createHash('sha256').update(password).digest('hex').substring(0, 16);
        if (passwordHash !== currentPasswordHash) {
            // Password has changed since this token was issued
            return false;
        }

        // Verify the signature
        const tokenData = `${passwordHash}:${timestamp}`;
        const expectedSignature = crypto.createHmac('sha256', password).update(tokenData).digest('hex');

        return signature === expectedSignature;
    } catch {
        return false;
    }
}

export function middleware(request: NextRequest) {
    // Protect /encode/dashboard
    if (request.nextUrl.pathname.startsWith('/encode/dashboard')) {
        const adminSession = request.cookies.get('admin_session');
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminSession || !adminPassword) {
            return NextResponse.redirect(new URL('/encode', request.url));
        }

        // Validate the session token
        if (!isValidSession(adminSession.value, adminPassword)) {
            // Invalid or expired token (password changed) - clear and redirect
            const response = NextResponse.redirect(new URL('/encode', request.url));
            response.cookies.delete('admin_session');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/encode/dashboard/:path*',
};
