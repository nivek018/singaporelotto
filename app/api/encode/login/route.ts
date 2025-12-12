import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { loginRateLimiter, getClientIP } from '@/lib/rate-limit';

// Create a session token that includes a hash of the password
// If the password changes, this hash won't match, invalidating the session
function createSessionToken(password: string): string {
    const timestamp = Date.now().toString();
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex').substring(0, 16);
    const tokenData = `${passwordHash}:${timestamp}`;
    // Sign the token with the password as secret
    const signature = crypto.createHmac('sha256', password).update(tokenData).digest('hex');
    return Buffer.from(`${tokenData}:${signature}`).toString('base64');
}

export async function POST(req: Request) {
    try {
        const clientIP = getClientIP(req);

        // Check rate limit before processing
        const rateLimit = loginRateLimiter.check(clientIP);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { success: false, message: rateLimit.message },
                {
                    status: 429,
                    headers: {
                        'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString(),
                        'X-RateLimit-Remaining': '0'
                    }
                }
            );
        }

        const { password } = await req.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Security: Only allow env password, no hardcoded fallbacks
        if (!adminPassword) {
            console.error('ADMIN_PASSWORD not set in environment');
            return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
        }

        if (password === adminPassword) {
            // Clear rate limit on successful login
            loginRateLimiter.clearAttempts(clientIP);

            const cookieStore = await cookies();
            const sessionToken = createSessionToken(adminPassword);

            // Non-expiring cookie (10 years)
            // Session invalidates when password changes because token contains password hash
            cookieStore.set('admin_session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
                path: '/'
            });

            return NextResponse.json({ success: true });
        }

        // Record failed attempt
        loginRateLimiter.recordAttempt(clientIP);
        const newLimit = loginRateLimiter.check(clientIP);

        return NextResponse.json(
            { success: false, message: 'Invalid password' },
            {
                status: 401,
                headers: {
                    'X-RateLimit-Remaining': newLimit.remaining.toString()
                }
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, message: 'Error processing request' }, { status: 500 });
    }
}
