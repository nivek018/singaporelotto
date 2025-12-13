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

// Fixed height container to prevent CLS
export function AdSense({ slot, format = "auto", responsive = true, className = "" }: AdSenseProps) {
    const adRef = useRef<HTMLModElement>(null);
    const isLoaded = useRef(false);

    useEffect(() => {
        // Only push ad once per component instance
        if (isLoaded.current) return;

        try {
            if (typeof window !== "undefined" && adRef.current) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isLoaded.current = true;
            }
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className={`ad-container ${className}`} style={{ minHeight: "100px" }}>
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
