import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Security headers to prevent XSS, clickjacking, and content injection
    async headers() {
        return [
            {
                // Apply to all routes
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN' // Prevents clickjacking
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff' // Prevents MIME type sniffing
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block' // Legacy XSS protection
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' // Disable unnecessary APIs
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: https: blob:",
                            "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
                            "frame-ancestors 'self'",
                            "base-uri 'self'",
                            "form-action 'self'"
                        ].join('; ')
                    }
                ]
            }
        ];
    },
    // Disable source maps in production to hide code structure
    productionBrowserSourceMaps: false,
};

export default nextConfig;
