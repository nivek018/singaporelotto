/**
 * Simple in-memory rate limiter for API routes
 * Tracks attempts by IP address with automatic cleanup
 */

interface RateLimitEntry {
    count: number;
    firstAttempt: number;
    blocked: boolean;
}

class RateLimiter {
    private attempts: Map<string, RateLimitEntry> = new Map();
    private readonly maxAttempts: number;
    private readonly windowMs: number;
    private readonly blockDurationMs: number;

    constructor(maxAttempts: number = 5, windowMs: number = 60000, blockDurationMs: number = 300000) {
        this.maxAttempts = maxAttempts; // Max attempts in window
        this.windowMs = windowMs; // Time window (default: 1 minute)
        this.blockDurationMs = blockDurationMs; // Block duration (default: 5 minutes)

        // Cleanup old entries every minute
        setInterval(() => this.cleanup(), 60000);
    }

    /**
     * Check if an IP is rate limited
     * @returns { allowed: boolean, remaining: number, resetIn: number }
     */
    check(ip: string): { allowed: boolean; remaining: number; resetIn: number; message?: string } {
        const now = Date.now();
        const entry = this.attempts.get(ip);

        if (!entry) {
            return { allowed: true, remaining: this.maxAttempts, resetIn: this.windowMs };
        }

        // If blocked, check if block has expired
        if (entry.blocked) {
            const blockRemaining = (entry.firstAttempt + this.blockDurationMs) - now;
            if (blockRemaining > 0) {
                return {
                    allowed: false,
                    remaining: 0,
                    resetIn: blockRemaining,
                    message: `Too many attempts. Try again in ${Math.ceil(blockRemaining / 1000)} seconds.`
                };
            }
            // Block expired, reset
            this.attempts.delete(ip);
            return { allowed: true, remaining: this.maxAttempts, resetIn: this.windowMs };
        }

        // Check if window has expired
        if (now - entry.firstAttempt > this.windowMs) {
            this.attempts.delete(ip);
            return { allowed: true, remaining: this.maxAttempts, resetIn: this.windowMs };
        }

        // Within window, check count
        const remaining = this.maxAttempts - entry.count;
        if (remaining <= 0) {
            // Block the IP
            entry.blocked = true;
            entry.firstAttempt = now; // Reset timer for block duration
            return {
                allowed: false,
                remaining: 0,
                resetIn: this.blockDurationMs,
                message: `Too many attempts. Try again in ${Math.ceil(this.blockDurationMs / 1000)} seconds.`
            };
        }

        return {
            allowed: true,
            remaining: remaining,
            resetIn: (entry.firstAttempt + this.windowMs) - now
        };
    }

    /**
     * Record an attempt from an IP
     */
    recordAttempt(ip: string): void {
        const now = Date.now();
        const entry = this.attempts.get(ip);

        if (!entry) {
            this.attempts.set(ip, { count: 1, firstAttempt: now, blocked: false });
            return;
        }

        // If window expired, reset
        if (now - entry.firstAttempt > this.windowMs && !entry.blocked) {
            this.attempts.set(ip, { count: 1, firstAttempt: now, blocked: false });
            return;
        }

        entry.count++;
    }

    /**
     * Clear attempts for an IP (call on successful login)
     */
    clearAttempts(ip: string): void {
        this.attempts.delete(ip);
    }

    /**
     * Cleanup old entries
     */
    private cleanup(): void {
        const now = Date.now();
        for (const [ip, entry] of this.attempts.entries()) {
            const maxAge = entry.blocked ? this.blockDurationMs : this.windowMs;
            if (now - entry.firstAttempt > maxAge) {
                this.attempts.delete(ip);
            }
        }
    }
}

// Singleton instance for login rate limiting
// 5 attempts per minute, 5-minute block after exceeding
export const loginRateLimiter = new RateLimiter(5, 60000, 300000);

// Get client IP from request headers
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    if (realIP) {
        return realIP;
    }

    // Fallback
    return 'unknown';
}
