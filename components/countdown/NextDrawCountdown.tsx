'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Timer, Flame } from 'lucide-react';

interface NextDrawCountdownProps {
    nextDrawDate: string;
    drawTime: string;
    drawDays: string;
    gameType: '4D' | 'Toto' | 'Sweep';
    specialRule?: string | null;
    serverTime?: string;
    isCascade?: boolean;  // For TOTO cascade draws
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
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
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, total };
}

const gameColors: Record<string, { bg: string; text: string; accent: string }> = {
    '4D': { bg: 'from-yellow-500 to-amber-600', text: 'text-yellow-500', accent: 'bg-yellow-500' },
    'Toto': { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-500', accent: 'bg-blue-500' },
    'Sweep': { bg: 'from-green-500 to-emerald-600', text: 'text-green-500', accent: 'bg-green-500' },
};

export function NextDrawCountdown({ nextDrawDate, drawTime, drawDays, gameType, specialRule, serverTime, isCascade }: NextDrawCountdownProps) {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
    const [mounted, setMounted] = useState(false);
    const offsetRef = useRef(0);

    // Pre-calculate static values that don't depend on client-side hydration
    const colors = gameColors[gameType];
    const nextDate = new Date(nextDrawDate);
    const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = nextDate.toLocaleDateString('en-SG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const getDrawDaysDisplay = () => {
        if (specialRule === 'first_wednesday_of_month') {
            return 'First Wednesday of the month';
        }
        return drawDays;
    };

    useEffect(() => {
        setMounted(true);

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
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [nextDrawDate, drawTime, serverTime]);

    const isDrawDay = timeRemaining ? timeRemaining.total <= 24 * 60 * 60 * 1000 && timeRemaining.total > 0 : false;

    // Render full structure always - only countdown numbers are dynamic
    return (
        <section className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}>
                    <div className="flex items-center gap-2">
                        <Timer className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Next Draw</h2>
                        {isCascade && (
                            <span className="ml-2 px-2 py-0.5 bg-orange-500 rounded-full text-xs font-bold flex items-center gap-1">
                                <Flame className="w-3 h-3" />
                                Cascade Draw
                            </span>
                        )}
                        {isDrawDay && (
                            <span className="ml-auto px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                                Draw Today!
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Countdown Timer */}
                        <div className="flex justify-center md:justify-start">
                            <div className="flex gap-3">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        {mounted && timeRemaining ? (
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{timeRemaining.days}</span>
                                        ) : (
                                            <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">--</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Days</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        {mounted && timeRemaining ? (
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{String(timeRemaining.hours).padStart(2, '0')}</span>
                                        ) : (
                                            <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">--</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Hours</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        {mounted && timeRemaining ? (
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                                        ) : (
                                            <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">--</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Mins</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        {mounted && timeRemaining ? (
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                                        ) : (
                                            <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">--</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Secs</span>
                                </div>
                            </div>
                        </div>

                        {/* Draw Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${colors.accent} flex items-center justify-center text-white`}>
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Draw Date</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{dayName}, {formattedDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${colors.accent} flex items-center justify-center text-white`}>
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Draw Time</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{drawTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Draw Days Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Regular draw days:</span> {getDrawDaysDisplay()}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
