'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, Flame } from 'lucide-react';

interface CompactCountdownProps {
    nextDrawDate: string;
    drawTime: string;
    gameType: '4D' | 'Toto' | 'Sweep';
    serverTime?: string;
    isCascade?: boolean;  // For TOTO cascade draws
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    total: number;
}

function parseDrawTime(drawTime: string): { hours: number; minutes: number } {
    const match = drawTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return { hours: 18, minutes: 30 };

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return { hours, minutes };
}

function calculateTimeRemaining(targetDate: Date, timeOffset: number): TimeRemaining {
    const now = new Date(Date.now() + timeOffset);
    const total = targetDate.getTime() - now.getTime();

    if (total <= 0) {
        return { days: 0, hours: 0, minutes: 0, total: 0 };
    }

    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, total };
}

const gameColors: Record<string, { text: string }> = {
    '4D': { text: 'text-yellow-600 dark:text-yellow-400' },
    'Toto': { text: 'text-blue-600 dark:text-blue-400' },
    'Sweep': { text: 'text-green-600 dark:text-green-400' },
};

export function CompactCountdown({ nextDrawDate, drawTime, gameType, serverTime, isCascade }: CompactCountdownProps) {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
    const [mounted, setMounted] = useState(false);
    const offsetRef = useRef(0);

    useEffect(() => {
        setMounted(true);

        // Calculate offset once at mount
        if (serverTime) {
            const serverDate = new Date(serverTime);
            const clientDate = new Date();
            offsetRef.current = serverDate.getTime() - clientDate.getTime();
        }

        const { hours, minutes } = parseDrawTime(drawTime);
        const targetDate = new Date(nextDrawDate);
        targetDate.setHours(hours, minutes, 0, 0);

        const updateCountdown = () => {
            setTimeRemaining(calculateTimeRemaining(targetDate, offsetRef.current));
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000);

        return () => clearInterval(interval);
    }, [nextDrawDate, drawTime, serverTime]);

    const colors = gameColors[gameType];
    const nextDate = new Date(nextDrawDate);
    const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = nextDate.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });

    // Skeleton with fixed dimensions to prevent CLS
    if (!mounted || !timeRemaining) {
        return (
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-2 min-h-[52px]">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
                    <div className="flex items-center gap-1.5">
                        <Clock className={`w-4 h-4 ${colors.text}`} />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Next Draw:
                        </span>
                    </div>
                    <span className={`text-sm font-bold ${colors.text}`}>
                        {dayName}, {formattedDate} • {drawTime.replace(' SGT', '')}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    const isDrawDay = timeRemaining.days === 0 && timeRemaining.total > 0;

    return (
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-2 min-h-[52px]">
            {/* Next Draw Info */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
                <div className="flex items-center gap-1.5">
                    <Clock className={`w-4 h-4 ${colors.text}`} />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Next Draw:
                    </span>
                </div>
                <span className={`text-sm font-bold ${colors.text}`}>
                    {dayName}, {formattedDate} • {drawTime.replace(' SGT', '')}
                </span>
                {isDrawDay && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                        TODAY
                    </span>
                )}
                {isCascade && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        CASCADE
                    </span>
                )}
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                {timeRemaining.days > 0 && (
                    <div className="flex items-baseline">
                        <span className="text-base sm:text-lg font-bold">{timeRemaining.days}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-0.5">d</span>
                    </div>
                )}
                <div className="flex items-baseline">
                    <span className="text-base sm:text-lg font-bold">{timeRemaining.hours.toString().padStart(2, '0')}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-0.5">h</span>
                </div>
                <div className="flex items-baseline">
                    <span className="text-base sm:text-lg font-bold">{timeRemaining.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-0.5">m</span>
                </div>
            </div>
        </div>
    );
}
