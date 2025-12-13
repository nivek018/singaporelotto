"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
        adsbygoogle: unknown[];
    }
}

// Delayed script loader - only loads after user interaction
export function DelayedScripts() {
    const hasLoaded = useRef(false);

    useEffect(() => {
        const loadScripts = () => {
            if (hasLoaded.current) return;
            hasLoaded.current = true;

            // Load Google Analytics
            const gaScript = document.createElement("script");
            gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-LKG4YZJWV7";
            gaScript.async = true;
            document.head.appendChild(gaScript);

            gaScript.onload = () => {
                window.dataLayer = window.dataLayer || [];
                window.gtag = function gtag(...args: unknown[]) {
                    window.dataLayer.push(args);
                };
                window.gtag("js", new Date());
                window.gtag("config", "G-LKG4YZJWV7");
            };

            // AdSense is now loaded in layout.tsx via next/script for better approval detection
            // We still delay the actual ad requests in the AdSense component

            // Remove event listeners after loading
            events.forEach((event) => {
                document.removeEventListener(event, loadScripts);
            });
        };

        // Events that trigger script loading
        const events = ["mousemove", "keydown", "scroll", "touchstart", "click"];

        // Set timeout as fallback (load after 5 seconds if no interaction)
        const timeout = setTimeout(loadScripts, 5000);

        // Add event listeners for user interaction
        events.forEach((event) => {
            document.addEventListener(event, loadScripts, { once: true, passive: true });
        });

        return () => {
            clearTimeout(timeout);
            events.forEach((event) => {
                document.removeEventListener(event, loadScripts);
            });
        };
    }, []);

    return null;
}
