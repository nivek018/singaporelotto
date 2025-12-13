import { FourDResult } from "@/components/results/FourD";
import { Metadata } from "next";
import pool from "@/lib/db";
import { FourDModel } from "@/lib/types";
import { getStats, Timeframe } from "@/lib/stats";
import { FourDStats } from "@/components/stats/FourDStats";
import { getGamePageTitle, shouldShowPlaceholder, getSchedule, getNextDrawDate } from "@/lib/schedule-utils";
import { NextDrawCountdown } from "@/components/countdown/NextDrawCountdown";
import { Clock } from "lucide-react";
import { PastDrawResults } from "@/components/PastDrawResults";
import { ResponsiveAd } from "@/components/ads/AdSense";

export async function generateMetadata(): Promise<Metadata> {
    const title = await getGamePageTitle('4D');
    return {
        title,
        description: "Latest 4D Results from Singapore Pools",
        alternates: {
            canonical: "/4d",
        },
    };
}

async function getLatestResult() {
    const [rows]: any = await pool.query('SELECT data FROM results WHERE type = "4D" ORDER BY draw_date DESC LIMIT 1');
    if (rows.length === 0) return null;
    return JSON.parse(rows[0].data) as FourDModel;
}

async function getRecentResults(skipFirst: boolean = true) {
    // Get 6 results; skip the first one only if not showing placeholder (since it's shown as the latest result above)
    const [rows]: any = await pool.query('SELECT data FROM results WHERE type = "4D" ORDER BY draw_date DESC LIMIT 6');
    return skipFirst
        ? rows.slice(1).map((row: any) => JSON.parse(row.data) as FourDModel)
        : rows.map((row: any) => JSON.parse(row.data) as FourDModel);
}

function ResultPlaceholder() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Today's Results Coming Soon
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    The draw is scheduled for today. Results will be available after 6:30 PM SGT.
                </p>
            </div>
        </div>
    );
}

export default async function FourDPage({ searchParams }: { searchParams: Promise<{ timeframe?: string }> }) {
    const { timeframe: timeframeParam } = await searchParams;
    const timeframe = (timeframeParam as Timeframe) || '30days';

    const showPlaceholder = await shouldShowPlaceholder('4D');
    const latest = await getLatestResult();
    // When showing placeholder, include latest in recent results (don't skip first)
    const recent = await getRecentResults(!showPlaceholder);
    const stats = await getStats('4D', timeframe);
    const schedule = await getSchedule('4D');
    const nextDrawDate = schedule ? getNextDrawDate(schedule) : new Date();

    // Server time for countdown offset calculation (Cloudflare cache-safe)
    const serverTime = new Date().toISOString();

    if (!latest && !showPlaceholder) return <div className="p-8 text-center">No data available.</div>;

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        4D Results
                    </h1>
                    <p className="text-lg text-blue-100 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Get the latest Singapore Pools 4D results updated live after every draw. 4D is Singapore's most popular lottery, drawn every Wednesday, Saturday, and Sunday at 6:30 PM. Players choose any four-digit number from 0000 to 9999. Browse the <a href="/4d/history" className="text-white underline hover:text-yellow-300">4D archive</a> for past results, or explore <a href="/toto" className="text-white underline hover:text-yellow-300">TOTO</a> and <a href="/sweep" className="text-white underline hover:text-yellow-300">Singapore Sweep</a> for bigger jackpots.
                    </p>
                </div>
            </section>

            {/* Ad below hero */}
            <div className="max-w-4xl mx-auto px-4 pt-6">
                <ResponsiveAd />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
                {/* Next Draw Countdown */}
                {schedule && (
                    <NextDrawCountdown
                        nextDrawDate={nextDrawDate.toISOString()}
                        drawTime={schedule.draw_time}
                        drawDays={schedule.draw_days}
                        gameType="4D"
                        serverTime={serverTime}
                    />
                )}

                {/* Latest Result */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        Latest Draw
                    </h2>
                    {showPlaceholder ? <ResultPlaceholder /> : latest && <FourDResult data={latest} />}
                </section>

                {/* Recent Results Table */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Results</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Draw Date</th>
                                    <th className="px-6 py-4">1st Prize</th>
                                    <th className="px-6 py-4">2nd Prize</th>
                                    <th className="px-6 py-4">3rd Prize</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recent.map((res) => (
                                    <tr key={res.drawNo} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {new Date(res.drawDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-yellow-600 dark:text-yellow-400">{res.winning[0]}</td>
                                        <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">{res.winning[1]}</td>
                                        <td className="px-6 py-4 font-bold text-orange-600 dark:text-orange-400">{res.winning[2]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-center">
                        <a
                            href="/4d/history"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
                        >
                            View Full History →
                        </a>
                    </div>
                </section>

                {/* Ad above Statistics */}
                <ResponsiveAd />

                {/* Statistics (Client Component) */}
                <FourDStats initialStats={stats} />

                {/* Statistics Glossary */}
                <section className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Use Lottery Statistics</h3>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">Digits Frequency:</span>
                                <span className="text-gray-700 dark:text-gray-300"> Tracks how often each individual digit (0-9) appears across all four positions of the winning 4D numbers. This helps identify which single digits show up most frequently in winning combinations.</span>
                            </div>
                            <div>
                                <span className="font-semibold text-red-600 dark:text-red-400">Hot Numbers:</span>
                                <span className="text-gray-700 dark:text-gray-300"> Digits that have been drawn most frequently over a specific period. Many players believe these numbers are on a "streak."</span>
                            </div>
                            <div>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">Cold Numbers:</span>
                                <span className="text-gray-700 dark:text-gray-300"> Digits that have not appeared for a long time. Some players choose these believing they are "overdue" to be drawn soon.</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">
                                Disclaimer: Lottery draws are random events. Past frequency does not guarantee future results.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Ad above Prize Structure */}
                <ResponsiveAd />

                {/* How to Play Section */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Play Singapore 4D</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Playing 4D involves selecting a four-digit number from 0000 to 9999. You can choose to place a "Big" bet or a "Small" bet.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                                <div>
                                    <span className="font-semibold text-gray-900 dark:text-white">Big Bet:</span>
                                    <span className="text-gray-700 dark:text-gray-300"> You win a prize if your number appears in any of the prize categories (1st, 2nd, 3rd, Starter, or Consolation prizes). This gives you more chances to win.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                <div>
                                    <span className="font-semibold text-gray-900 dark:text-white">Small Bet:</span>
                                    <span className="text-gray-700 dark:text-gray-300"> You only win if your number appears in the top three positions (1st, 2nd, or 3rd Prize). The winning amounts are higher, but the chances are lower.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                <div>
                                    <span className="font-semibold text-gray-900 dark:text-white">Minimum Bet:</span>
                                    <span className="text-gray-700 dark:text-gray-300"> The minimum bet amount is $1, inclusive of GST.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Prize Structure Table */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4D Prize Structure</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Prize Category</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Big Bet (per $1)</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Small Bet (per $1)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr className="bg-yellow-50 dark:bg-yellow-900/10">
                                    <td className="px-4 py-3 font-bold text-yellow-700 dark:text-yellow-400">1st Prize</td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">$2,000</td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">$3,000</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">2nd Prize</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">$1,000</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">$2,000</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">3rd Prize</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">$490</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">$800</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Starter Prize (10 numbers)</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">$250</td>
                                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-500">—</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Consolation Prize (10 numbers)</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">$60</td>
                                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-500">—</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
                            * Small bets do not cover Starter and Consolation prizes.
                        </div>
                    </div>
                </section>

                {/* 4D FAQ Section */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4D Frequently Asked Questions</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What is an iBet?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                iBet allows you to cover all permutations of your 4-digit number. For example, if you play "1234" on iBet, you win if any combination (like "4321" or "2143") is drawn. The prize money is proportionately reduced based on the number of permutations.
                            </p>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How much do I win for a $1 Big Bet on the 1st Prize?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                If you place a $1 Big bet and match the 1st Prize number, the winning amount is $2,000.
                            </p>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How much do I win for a $1 Small Bet on the 1st Prize?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                If you place a $1 Small bet and match the 1st Prize number, the winning amount is significantly higher at $3,000.
                            </p>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I buy 4D numbers for future draws?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                Yes, you can place bets for up to six consecutive draws in advance, including the current draw.
                            </p>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What happens if my 4D number wins multiple categories?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                If your selected number appears in multiple prize categories (e.g., it comes out as both 1st Prize and a Starter Prize), you will win the prize money for both categories.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Odds of Winning */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Odds of Winning 4D</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="p-5">
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                                Your chances of winning depend on the bet type. Since there are 10,000 possible numbers (0000 to 9999), here is the breakdown:
                            </p>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Prize Category</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Odds</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">1st Prize</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">1 in 10,000</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Any Prize (Big Bet)</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">23 in 10,000</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Any Prize (Small Bet)</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">3 in 10,000</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-500 dark:text-gray-400">
                            * 23 winning numbers are drawn per draw: 1st, 2nd, 3rd + 10 Starter + 10 Consolation prizes.
                        </div>
                    </div>
                </section>

                {/* Important Rules for Winners */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Important Rules for Winners</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Is Lottery Winnings Taxable in Singapore?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                No. Lottery winnings in Singapore are exempt from tax. Whether you win $10 or $1,000,000, you keep the full amount. There is no capital gains tax or income tax applied to lottery prizes.
                            </p>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can Tourists and Foreigners Play?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                Yes. Foreigners and tourists can legally purchase tickets and claim prizes in Singapore, provided they are at least 21 years old and possess a valid passport or identification for prize claims.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Important Reminders */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Important Reminders for Players</h2>
                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800 p-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                                    <span className="text-amber-500">⏰</span> Sales Cut-Off Time
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Don't be late! Ticket sales for all Singapore Pools lottery games close sharply at 6:00 PM on the day of the draw. If you are buying online or via the app, try to place your bets earlier to avoid network congestion.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                                    <span className="text-amber-500">🎫</span> Take Care of Your Ticket
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Physical lottery tickets are printed on thermal paper. Do not iron or expose them to high heat (like leaving them on a car dashboard), as the text will turn black and become unreadable. Keep it dry and safe—a damaged or unreadable ticket may be rejected during prize claims.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                                    <span className="text-amber-500">📅</span> Ticket Validity Period
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    All winning tickets are valid for 180 days (approximately 6 months) from the date of the draw. If you do not claim your prize within this window, the money is forfeited and donated to charity. No appeals are accepted for expired tickets.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                                    <span className="text-amber-500">🚨</span> Beware of Lottery Scams
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Singapore Pools will never request personal information or fees to unlock a prize. If you receive an email or message claiming you won a lottery you didn't enter, it is a scam. Genuine winnings are only paid out when you present a valid winning ticket.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Ad above Past Draw Results */}
            <div className="max-w-4xl mx-auto px-4 pb-6">
                <ResponsiveAd />
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
