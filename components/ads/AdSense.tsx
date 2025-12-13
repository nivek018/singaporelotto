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
        __adsLoaded?: boolean;
    }
}

// Smart AdSense component that only shows when ad fills
export function AdSense({ slot, format = "auto", responsive = true, className = "" }: AdSenseProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const adRef = useRef<HTMLModElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);
    const isLoaded = useRef(false);

    // Wait for user interaction before loading ads
    useEffect(() => {
        const handleInteraction = () => {
            setUserInteracted(true);
            // Remove listeners after first interaction
            events.forEach(event => document.removeEventListener(event, handleInteraction));
        };

        const events = ["mousemove", "keydown", "scroll", "touchstart", "click"];
        events.forEach(event => document.addEventListener(event, handleInteraction, { once: true, passive: true }));

        // Fallback: load after 5 seconds even without interaction
        const timeout = setTimeout(() => setUserInteracted(true), 5000);

        return () => {
            clearTimeout(timeout);
            events.forEach(event => document.removeEventListener(event, handleInteraction));
        };
    }, []);

    // Load ad after user interaction
    useEffect(() => {
        if (!userInteracted || isLoaded.current || !adRef.current) return;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            isLoaded.current = true;

            // Watch for ad content to appear
            const observer = new MutationObserver(() => {
                if (containerRef.current) {
                    // Check if ad has actual content (height > 0)
                    const insElement = containerRef.current.querySelector('ins');
                    if (insElement && insElement.clientHeight > 0) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                }
            });

            if (containerRef.current) {
                observer.observe(containerRef.current, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'data-ad-status']
                });
            }

            // Fallback: check after a delay in case observer misses it
            setTimeout(() => {
                if (containerRef.current) {
                    const insElement = containerRef.current.querySelector('ins');
                    if (insElement && insElement.clientHeight > 0) {
                        setIsVisible(true);
                    }
                }
                observer.disconnect();
            }, 3000);

            return () => observer.disconnect();
        } catch (err) {
            // Silently ignore AdSense errors
        }
    }, [userInteracted]);

    return (
        <div
            ref={containerRef}
            className={`ad-container transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'} ${className}`}
        >
            <ins
                ref={adRef}
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

