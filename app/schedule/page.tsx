import { constructMetadata } from "@/lib/metadata";
import pool from "@/lib/db";
import { ScheduleModel } from "@/lib/types";
import { Calendar, Clock, Timer, Ticket, Target, Gift } from "lucide-react";
import { PastDrawResults } from "@/components/PastDrawResults";
import { ResponsiveAd } from "@/components/ads/AdSense";

export const metadata = constructMetadata({
    title: "Draw Schedule - SG Lotto",
    description: "Complete draw schedule for Singapore 4D, Toto, and Sweep lottery games. Find out when draws happen and sales closing times.",
    path: "/schedule",
});

async function getSchedules(): Promise<ScheduleModel[]> {
    const [rows]: any = await pool.query('SELECT * FROM schedules ORDER BY FIELD(game_type, "4D", "Toto", "Sweep")');
    return rows.map((row: any) => ({
        id: row.id,
        gameType: row.game_type,
        drawDays: row.draw_days,
        drawTime: row.draw_time,
        description: row.description,
        salesCloseTime: row.sales_close_time,
    }));
}

const gameIcons: Record<string, React.ReactNode> = {
    '4D': <Target className="w-8 h-8" />,
    'Toto': <Ticket className="w-8 h-8" />,
    'Sweep': <Gift className="w-8 h-8" />,
};

const gameColors: Record<string, { bg: string; gradient: string; border: string }> = {
    '4D': {
        bg: 'bg-emerald-500',
        gradient: 'from-emerald-500 to-emerald-600',
        border: 'border-emerald-200 dark:border-emerald-800',
    },
    'Toto': {
        bg: 'bg-blue-500',
        gradient: 'from-blue-500 to-blue-600',
        border: 'border-blue-200 dark:border-blue-800',
    },
    'Sweep': {
        bg: 'bg-purple-500',
        gradient: 'from-purple-500 to-purple-600',
        border: 'border-purple-200 dark:border-purple-800',
    },
};

export default async function SchedulePage() {
    const schedules = await getSchedules();

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Draw Schedule
                    </h1>
                    <p className="text-lg text-blue-100 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Complete draw schedule for Singapore 4D, Toto, and Sweep lottery games
                    </p>
                </div>
            </section>

            {/* Ad below hero */}
            <div className="max-w-4xl mx-auto px-4 pt-6">
                <ResponsiveAd />
            </div>

            {/* Quick Overview */}
            <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {schedules.map((schedule) => (
                        <div
                            key={schedule.gameType}
                            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-t-4 ${gameColors[schedule.gameType]?.border} hover:shadow-xl transition-shadow`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${gameColors[schedule.gameType]?.gradient} text-white`}>
                                    {gameIcons[schedule.gameType]}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{schedule.gameType}</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{schedule.drawDays}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span>Draw: {schedule.drawTime}</span>
                                </div>
                                {schedule.salesCloseTime && (
                                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                        <Timer className="w-4 h-4" />
                                        <span>Sales Close: {schedule.salesCloseTime}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Detailed Sections */}
            <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
                {schedules.map((schedule) => (
                    <article
                        key={schedule.gameType}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                        {/* Game Header */}
                        <div className={`bg-gradient-to-r ${gameColors[schedule.gameType]?.gradient} p-6 text-white`}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    {gameIcons[schedule.gameType]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{schedule.gameType}</h2>
                                    <p className="text-white/80 text-sm">Singapore Pools Official Game</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Description */}
                            {schedule.description && (
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {schedule.description}
                                    </p>
                                </div>
                            )}

                            {/* Schedule Table */}
                            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Details</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Information</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                <span className="font-medium">Draw Days</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                                                {schedule.drawDays}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Clock className="w-4 h-4 text-green-500" />
                                                <span className="font-medium">Draw Time</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                                                {schedule.drawTime}
                                            </td>
                                        </tr>
                                        {schedule.salesCloseTime && (
                                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Timer className="w-4 h-4 text-orange-500" />
                                                    <span className="font-medium">Sales Close</span>
                                                </td>
                                                <td className="px-6 py-4 text-orange-600 dark:text-orange-400 font-semibold">
                                                    {schedule.salesCloseTime}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* CTA Link */}
                            <div className="flex justify-end">
                                <a
                                    href={`/${schedule.gameType.toLowerCase()}`}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r ${gameColors[schedule.gameType]?.gradient} text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-md`}
                                >
                                    View {schedule.gameType} Results
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14" />
                                        <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            {/* Ad above Important Information */}
            <div className="max-w-4xl mx-auto px-4 pt-6">
                <ResponsiveAd />
            </div>

            {/* Additional Information */}
            <section className="bg-gray-50 dark:bg-gray-800/50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Important Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-500" />
                                Draw Times
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                All draw times are in Singapore Time (SGT/UTC+8). Make sure to purchase your tickets before the sales closing time.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-500" />
                                Special Draws
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Additional draws may be held on special occasions and public holidays. Check Singapore Pools for announcements.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-purple-500" />
                                Where to Buy Tickets
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Tickets can be purchased at authorized Singapore Pools outlets islandwide or online via the official Singapore Pools app and website.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Gift className="w-5 h-5 text-orange-500" />
                                Prize Claim Period
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                All winning tickets must be claimed within 180 days from the draw date. Unclaimed prizes are forfeited and donated to charity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Tips Section */}
            <section className="max-w-4xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Quick Tips for Players
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">1</span>
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-white">Buy Early</span>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Purchase your tickets well before the 6:00 PM cut-off to avoid last-minute queues or online congestion.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-bold">2</span>
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-white">Keep Tickets Safe</span>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Physical tickets are printed on thermal paper. Avoid heat and moisture. A damaged ticket may be rejected.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-bold">3</span>
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-white">Check Results Promptly</span>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Results are available shortly after each draw. Check your tickets regularly and don&apos;t let winning tickets expire.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-bold">4</span>
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-white">Claim Prizes on Time</span>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">You have 180 days to claim winnings. Prizes up to $5,000 can be claimed at any outlet; larger amounts require the main branch.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">5</span>
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-white">Play Responsibly</span>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Set a budget and stick to it. Lottery is meant to be entertainment, not an investment strategy.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Responsible Gaming */}
            <section className="max-w-4xl mx-auto px-4 pb-12">
                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="text-amber-500">⚠️</span> Responsible Gaming
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                        Gambling can be addictive. If you or someone you know has a gambling problem, help is available.
                    </p>
                    <a
                        href="https://www.ncpg.org.sg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm font-medium hover:underline"
                    >
                        National Council on Problem Gambling (NCPG)
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                </div>
            </section>

            {/* Ad above Past Draw Results */}
            <div className="max-w-4xl mx-auto px-4 pb-6">
                <ResponsiveAd />
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
