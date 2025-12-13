"use client";

import { useEffect, useRef } from "react";

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

// Set this to true once AdSense approves your account
// This prevents ugly white boxes from showing before approval
const SHOW_ADS = false;

// Fixed height container to prevent CLS with theme-aware background
export function AdSense({ slot, format = "auto", responsive = true, className = "" }: AdSenseProps) {
    const adRef = useRef<HTMLModElement>(null);
    const isLoaded = useRef(false);

    useEffect(() => {
        // Don't load ads until approved
        if (!SHOW_ADS) return;

        // Only push ad once per component instance
        if (isLoaded.current) return;

        try {
            if (typeof window !== "undefined" && adRef.current) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isLoaded.current = true;
            }
        } catch (err) {
            // Silently ignore AdSense errors (ads not loaded yet, blocked, etc.)
        }
    }, []);

    // Don't render anything until AdSense is approved
    if (!SHOW_ADS) {
        return null;
    }

    return (
        <div
            className={`ad-container bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden ${className}`}
            style={{ minHeight: "100px" }}
        >
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "block", background: "inherit" }}
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
    if (!SHOW_ADS) return null;
    return (
        <div className={`hidden md:block ${className}`}>
            <AdSense slot="7476720594" />
        </div>
    );
}

// Mobile-only ad (hidden on desktop)
export function MobileAd({ className = "" }: { className?: string }) {
    if (!SHOW_ADS) return null;
    return (
        <div className={`block md:hidden ${className}`}>
            <AdSense slot="8023515505" />
        </div>
    );
}

// Responsive ad that shows appropriate version based on screen size
export function ResponsiveAd({ className = "" }: { className?: string }) {
    if (!SHOW_ADS) return null;
    return (
        <div className={className}>
            <DesktopAd />
            <MobileAd />
        </div>
    );
}

