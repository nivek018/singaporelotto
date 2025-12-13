"use client";

import { useEffect } from "react";

// Suppress harmless console errors in both dev and production
// These errors don't affect functionality and are just noise
export function SuppressHydrationWarning() {
    useEffect(() => {
        const originalError = console.error;
        const originalWarn = console.warn;

        console.error = (...args) => {
            const message = typeof args[0] === "string" ? args[0] : "";

            // Suppress React hydration mismatch errors
            if (
                message.includes("Hydration failed") ||
                message.includes("Text content does not match") ||
                message.includes("did not match") ||
                message.includes("Minified React error #418") ||
                message.includes("Minified React error #423") ||
                message.includes("Minified React error #425")
            ) {
                return;
            }

            // Suppress AdSense errors (normal when ads not approved or blocked)
            if (
                message.includes("adsbygoogle") ||
                message.includes("availableWidth=0") ||
                message.includes("No slot size")
            ) {
                return;
            }

            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            const message = typeof args[0] === "string" ? args[0] : "";

            // Suppress hydration warnings
            if (
                message.includes("Hydration") ||
                message.includes("hydration") ||
                message.includes("did not match")
            ) {
                return;
            }

            originalWarn.apply(console, args);
        };

        // Cleanup on unmount
        return () => {
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, []);

    return null;
}
