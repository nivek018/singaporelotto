import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple session validation using Web Crypto API (Edge Runtime compatible)
async function isValidSession(token: string, password: string): Promise<boolean> {
    try {
        const decoded = atob(token);
        const parts = decoded.split(':');
        if (parts.length !== 3) return false;

        const [passwordHash, timestamp, signature] = parts;

        // Hash the password using Web Crypto API
        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', passwordData);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const currentPasswordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);

        if (passwordHash !== currentPasswordHash) {
            // Password has changed since this token was issued
            return false;
        }

        // Verify the signature using HMAC-SHA256
        const tokenData = `${passwordHash}:${timestamp}`;
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(tokenData));
        const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        return signature === expectedSignature;
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    // Protect /encode/dashboard
    if (request.nextUrl.pathname.startsWith('/encode/dashboard')) {
        const adminSession = request.cookies.get('admin_session');
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminSession || !adminPassword) {
            return NextResponse.redirect(new URL('/encode', request.url));
        }

        // Validate the session token
        const isValid = await isValidSession(adminSession.value, adminPassword);
        if (!isValid) {
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
