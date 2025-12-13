"use client";

import { useEffect, useRef, useState } from "react";

interface AdSenseProps {
    slot: string;
    format?: string;
    responsive?: boolean;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

// Smart AdSense component - doesn't render anything until user interacts AND ad fills
export function AdSense({ slot, format = "auto", responsive = true, className = "" }: AdSenseProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldRender, setShouldRender] = useState(false);
    const [adFilled, setAdFilled] = useState(false);
    const hasInitialized = useRef(false);

    // Wait for user interaction before rendering the ad element
    useEffect(() => {
        if (hasInitialized.current) return;

        const handleInteraction = () => {
            hasInitialized.current = true;
            setShouldRender(true);
            events.forEach(event => document.removeEventListener(event, handleInteraction));
        };

        const events = ["mousemove", "keydown", "scroll", "touchstart", "click"];
        events.forEach(event => document.addEventListener(event, handleInteraction, { once: true, passive: true }));

        // Fallback: render after 5 seconds even without interaction
        const timeout = setTimeout(() => {
            if (!hasInitialized.current) {
                hasInitialized.current = true;
                setShouldRender(true);
            }
        }, 5000);

        return () => {
            clearTimeout(timeout);
            events.forEach(event => document.removeEventListener(event, handleInteraction));
        };
    }, []);

    // After rendering, push to adsbygoogle and watch for ad fill
    useEffect(() => {
        if (!shouldRender || !containerRef.current) return;

        // Small delay to ensure DOM is ready
        const pushTimeout = setTimeout(() => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                // Silently ignore
            }

            // Check for ad fill after a delay
            const checkFill = () => {
                if (containerRef.current) {
                    const ins = containerRef.current.querySelector('ins');
                    const iframe = containerRef.current.querySelector('iframe');

                    // Ad is filled if there's an iframe with content or ins has height
                    if ((iframe && iframe.clientHeight > 0) || (ins && ins.clientHeight > 50)) {
                        setAdFilled(true);
                    }
                }
            };

            // Check multiple times with increasing delays
            setTimeout(checkFill, 1000);
            setTimeout(checkFill, 2000);
            setTimeout(checkFill, 3000);
        }, 100);

        return () => clearTimeout(pushTimeout);
    }, [shouldRender]);

    // Don't render anything until user interacts
    if (!shouldRender) {
        return null;
    }

    // Render but keep hidden until ad fills
    return (
        <div
            ref={containerRef}
            style={{
                display: adFilled ? 'block' : 'none',
                minHeight: adFilled ? undefined : 0,
            }}
            className={className}
        >
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-3980043434451295"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
}

// Desktop-only ad (hidden on mobile)
export function DesktopAd({ className = "" }: { className?: string }) {
    return (
        <div className={`hidden md:block ${className}`}>
            <AdSense slot="7476720594" />
        </div>
    );
}

// Mobile-only ad (hidden on desktop)
export function MobileAd({ className = "" }: { className?: string }) {
    return (
        <div className={`block md:hidden ${className}`}>
            <AdSense slot="8023515505" />
        </div>
    );
}

// Responsive ad that shows appropriate version based on screen size
export function ResponsiveAd({ className = "" }: { className?: string }) {
    return (
        <div className={className}>
            <DesktopAd />
            <MobileAd />
        </div>
    );
}


