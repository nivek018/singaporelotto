import { TotoResult } from "@/components/results/Toto";
import { Metadata } from "next";
import pool from "@/lib/db";
import { TotoModel } from "@/lib/types";
import { getStats, Timeframe } from "@/lib/stats";
import { TotoStats } from "@/components/stats/TotoStats";
import { getGamePageTitle, shouldShowPlaceholder, getSchedule, getNextDrawDate, getTotoDrawTime, getTotoCascadeStatus } from "@/lib/schedule-utils";
import { NextDrawCountdown } from "@/components/countdown/NextDrawCountdown";
import { Clock, Flame } from "lucide-react";
import { PastDrawResults } from "@/components/PastDrawResults";
import { ResponsiveAd } from "@/components/ads/AdSense";

export async function generateMetadata(): Promise<Metadata> {
    const title = await getGamePageTitle('Toto');
    return {
        title,
        description: "Latest Toto Results from Singapore Pools",
        alternates: {
            canonical: "/toto",
        },
    };
}

async function getLatestResult() {
    const [rows]: any = await pool.query('SELECT data FROM results WHERE type = "Toto" ORDER BY draw_date DESC LIMIT 1');
    if (rows.length === 0) return null;
    return JSON.parse(rows[0].data) as TotoModel;
}

async function getRecentResults(skipFirst: boolean = true) {
    // Get 6 results; skip the first one only if not showing placeholder (since it's shown as the latest result above)
    const [rows]: any = await pool.query('SELECT data FROM results WHERE type = "Toto" ORDER BY draw_date DESC LIMIT 6');
    return skipFirst
        ? rows.slice(1).map((row: any) => JSON.parse(row.data) as TotoModel)
        : rows.map((row: any) => JSON.parse(row.data) as TotoModel);
}

function ResultPlaceholder() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Today's Results Coming Soon
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    The draw is scheduled for today. Results will be available after 9:30 PM SGT.
                </p>
            </div>
        </div>
    );
}

export default async function TotoPage({ searchParams }: { searchParams: Promise<{ timeframe?: string }> }) {
    const { timeframe: timeframeParam } = await searchParams;
    const timeframe = (timeframeParam as Timeframe) || '30days';

    const showPlaceholder = await shouldShowPlaceholder('Toto');
    const latest = await getLatestResult();
    // When showing placeholder, include latest in recent results (don't skip first)
    const recent = await getRecentResults(!showPlaceholder);
    const stats = await getStats('Toto', timeframe);
    const schedule = await getSchedule('Toto');
    const nextDrawDate = schedule ? getNextDrawDate(schedule) : new Date();

    // Get cascade status for TOTO
    const totoDrawTimeInfo = await getTotoDrawTime();
    const cascadeStatus = await getTotoCascadeStatus();

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
                        Toto Results
                    </h1>
                    <p className="text-lg text-blue-100 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Get the latest Singapore Pools TOTO results and prize breakdowns updated live. TOTO draws happen every Monday and Thursday at 6:30 PM, with <a href="/jackpot" className="text-white underline hover:text-yellow-300">Cascade Draws</a> extending to 9:30 PM when jackpots roll over. Check the <a href="/toto/history" className="text-white underline hover:text-yellow-300">TOTO archive</a> for past results, or try your luck with <a href="/4d" className="text-white underline hover:text-yellow-300">4D</a> and <a href="/sweep" className="text-white underline hover:text-yellow-300">Singapore Sweep</a>.
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
                        drawTime={totoDrawTimeInfo.isCascade ? `${totoDrawTimeInfo.drawTime.replace(':', ':')} PM` : schedule.draw_time}
                        drawDays={schedule.draw_days}
                        gameType="Toto"
                        serverTime={serverTime}
                        isCascade={totoDrawTimeInfo.isCascade}
                    />
                )}

                {/* Cascade Draw Notice */}
                {totoDrawTimeInfo.isCascade && cascadeStatus && (
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">🔥 Cascade Draw Active!</h3>
                                <p className="text-orange-100 text-sm">
                                    {cascadeStatus.consecutiveNoWinner} consecutive draws without a Group 1 winner.
                                    Draw time moved to <strong>9:30 PM</strong> for this draw.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Latest Result */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        Latest Draw
                    </h2>
                    {showPlaceholder ? <ResultPlaceholder /> : latest && <TotoResult data={latest} />}
                </section>

                {/* Recent Results Table */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Results</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium">
                                <tr>
                                    <th className="px-4 py-4 sm:px-6">Draw Date</th>
                                    <th className="px-4 py-4 sm:px-6">Winning Numbers</th>
                                    <th className="px-4 py-4 sm:px-6">Additional</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recent.map((res) => (
                                    <tr key={res.drawNo} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                            {new Date(res.drawDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 py-4 sm:px-6">
                                            <div className="flex gap-1.5 flex-wrap">
                                                {res.winning.map((num) => (
                                                    <span key={num} className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                                                        {num}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 sm:px-6">
                                            <span className="w-8 h-8 rounded-full bg-yellow-500 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                                                {res.additional}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-center">
                        <a
                            href="/toto/history"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            View Full History →
                        </a>
                    </div>
                </section>

                {/* Ad above Statistics */}
                <ResponsiveAd />

                {/* Statistics (Client Component) */}
                <TotoStats initialStats={stats} />

                {/* Statistics Glossary */}
                <section className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Use Lottery Statistics</h3>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">Number Frequency:</span>
                                <span className="text-gray-700 dark:text-gray-300"> Tracks how often each number (1-49) appears in TOTO winning draws, including both the 6 main numbers and the Additional Number. Use this to see which numbers have been drawn most or least often.</span>
                            </div>
                            <div>
                                <span className="font-semibold text-red-600 dark:text-red-400">Hot Numbers:</span>
                                <span className="text-gray-700 dark:text-gray-300"> Numbers that have been drawn most frequently over a specific period. Many players believe these numbers are on a "streak."</span>
                            </div>
                            <div>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">Cold Numbers:</span>
                                <span className="text-gray-700 dark:text-gray-300"> Numbers that have not appeared for a long time. Some players choose these believing they are "overdue" to be drawn soon.</span>
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Play TOTO</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            To play TOTO, you must pick at least 6 numbers between 1 and 49.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                <div>
                                    <span className="font-semibold text-gray-900 dark:text-white">Ordinary Entry:</span>
                                    <span className="text-gray-700 dark:text-gray-300"> Select exactly 6 numbers.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                                <div>
                                    <span className="font-semibold text-gray-900 dark:text-white">System Entry:</span>
                                    <span className="text-gray-700 dark:text-gray-300"> Select 7 to 12 numbers (System 7 to System 12). This creates multiple combinations of 6 numbers, increasing your chances of winning but costing more.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                <div>
                                    <span className="font-semibold text-gray-900 dark:text-white">System Roll:</span>
                                    <span className="text-gray-700 dark:text-gray-300"> Pick 5 numbers and "roll" the 6th number to cover all remaining 44 possibilities.</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
                            To win the Group 1 Jackpot, all 6 of your chosen numbers must match the 6 winning numbers drawn.
                        </p>
                    </div>
                </section>

                {/* Prize Structure Table */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">TOTO Prize Structure</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Prize Group</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Winning Criteria</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Prize Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr className="bg-yellow-50 dark:bg-yellow-900/10">
                                    <td className="px-4 py-3 font-bold text-yellow-700 dark:text-yellow-400">Group 1 (Jackpot)</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Match 6 Numbers</td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Min $1,000,000</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 2</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Match 5 Numbers + Additional Number</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">8% of prize pool</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 3</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Match 5 Numbers</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">5.5% of prize pool</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 4</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Match 4 Numbers + Additional Number</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">3% of prize pool</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 5</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Match 4 Numbers</td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">$50</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 6</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Match 3 Numbers + Additional Number</td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">$25</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 7</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Match 3 Numbers</td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">$10</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* TOTO FAQ Section */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">TOTO Frequently Asked Questions</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What is the cost of a System 7 bet?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                A System 7 bet costs $7. It gives you 7 ordinary entries worth of combinations.
                            </p>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What is the "Additional Number"?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                During the draw, 6 main numbers are picked first, followed by one "Additional Number." This extra number is used to determine winners for Prize Groups 2, 4, and 6 (it does not affect the Jackpot Group 1).
                            </p>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What happens if there is no Jackpot winner?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                If no one wins the Group 1 Prize, the money "snowballs" (rolls over) to the next draw. This can happen for up to 4 consecutive draws.
                            </p>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What is a Cascade Draw?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                If the jackpot snowballs for 3 draws and is still not won on the 4th draw, a "Cascade" happens. The entire jackpot amount flows down and is shared among the winners of the Group 2 prize category.
                            </p>
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What are the odds of winning the TOTO Jackpot?</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                The odds of winning the Group 1 Jackpot with a standard Ordinary Entry (6 numbers) are approximately 1 in 14 million.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Odds of Winning */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Odds of Winning TOTO</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="p-5">
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                                Winning the TOTO Jackpot requires matching all 6 numbers from a pool of 49. Here are the odds for each prize group:
                            </p>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Prize Group</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Odds</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr className="bg-yellow-50 dark:bg-yellow-900/10">
                                    <td className="px-4 py-3 font-bold text-yellow-700 dark:text-yellow-400">Group 1 (Jackpot)</td>
                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">1 in 13,983,816</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 2</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">1 in 2,330,636</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 3</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">1 in 55,491</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 4</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">1 in 22,197</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 5</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">1 in 1,083</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 6</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">1 in 812</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Group 7</td>
                                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">1 in 61</td>
                                </tr>
                                <tr className="bg-green-50 dark:bg-green-900/10">
                                    <td className="px-4 py-3 font-medium text-green-700 dark:text-green-400">Any Prize</td>
                                    <td className="px-4 py-3 text-right font-semibold text-green-700 dark:text-green-400">~1 in 54</td>
                                </tr>
                            </tbody>
                        </table>
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
