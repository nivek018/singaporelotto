import { constructMetadata } from "@/lib/metadata";
import pool from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Trophy, TrendingUp, Calendar, Sparkles, HelpCircle, Info, DollarSign } from "lucide-react";
import { PastDrawResults } from "@/components/PastDrawResults";

export const metadata = constructMetadata({
    title: "Jackpot Prizes - SG Lotto Results",
    description: "Latest Jackpot Prizes for Singapore TOTO, 4D, and Singapore Sweep lottery games",
    path: "/jackpot",
});

async function getLatestJackpots() {
    // Get latest TOTO result
    const [totoRows]: any = await pool.query('SELECT data FROM results WHERE type = "Toto" ORDER BY draw_date DESC LIMIT 1');
    let totoJackpot = 0;
    let totoDrawDate = '';
    if (totoRows.length > 0) {
        const data = JSON.parse(totoRows[0].data);
        totoDrawDate = data.drawDate || '';
        if (data.winningShares && data.winningShares[0]) {
            totoJackpot = data.winningShares[0].prizeAmount || 0;
        }
    }

    // Find largest TOTO jackpot for the CURRENT YEAR only
    const currentYear = new Date().getFullYear();
    const [yearTotoRows]: any = await pool.query(
        'SELECT data, draw_date FROM results WHERE type = "Toto" AND YEAR(draw_date) = ?',
        [currentYear]
    );
    let largestJackpotThisYear = 0;
    let largestJackpotDate = '';
    for (const row of yearTotoRows) {
        try {
            const data = JSON.parse(row.data);
            if (data.winningShares && data.winningShares[0]) {
                const prizeAmount = data.winningShares[0].prizeAmount || 0;
                if (prizeAmount > largestJackpotThisYear) {
                    largestJackpotThisYear = prizeAmount;
                    largestJackpotDate = data.drawDate || row.draw_date;
                }
            }
        } catch (e) {
            // Skip malformed data
        }
    }

    return { totoJackpot, totoDrawDate, largestJackpotThisYear, largestJackpotDate, currentYear };
}

export default async function JackpotPage() {
    const { totoJackpot, totoDrawDate, largestJackpotThisYear, largestJackpotDate, currentYear } = await getLatestJackpots();

    // Fixed prize amounts for other games
    const fourDFirstPrize = 2000; // $2,000 for every $1 bet on 4D 1st Prize
    const sweepGrandPrize = 2300000; // $2.3 million Singapore Sweep Grand Prize

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Jackpot Prizes
                    </h1>
                    <p className="text-lg text-blue-100 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Track the latest TOTO Group 1 prize and snowball amounts for upcoming draws. TOTO jackpots roll over when there are no Group 1 winners, creating massive prize pools. Also view fixed prize amounts for <a href="/4d" className="text-white underline hover:text-yellow-300">4D</a> and <a href="/sweep" className="text-white underline hover:text-yellow-300">Singapore Sweep</a>.
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Toto Jackpot - Featured */}
                    <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">TOTO Group 1 Prize</h2>
                                        <p className="text-blue-100 text-sm">Last draw jackpot amount</p>
                                    </div>
                                </div>
                                <Sparkles className="w-8 h-8 text-yellow-300" />
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                {formatCurrency(totoJackpot)}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                {totoDrawDate ? `From draw on ${new Date(totoDrawDate).toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}` : 'Latest draw prize'}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="/toto"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    View TOTO Results
                                    <TrendingUp className="w-4 h-4" />
                                </a>
                                <a
                                    href="/toto/history"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                                >
                                    View Past Jackpots
                                </a>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                                * TOTO draws happen every Monday and Thursday at 6:30 PM. When no one wins Group 1, the prize &quot;snowballs&quot; to the next draw.
                            </p>
                        </div>
                    </div>

                    {/* 4D Prize */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 text-white">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5" />
                                <h2 className="text-lg font-bold">4D 1st Prize</h2>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                $2,000
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                Per $1 Big bet (fixed)
                            </p>
                            <a
                                href="/4d"
                                className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 hover:underline text-sm font-medium"
                            >
                                View 4D Results
                                <TrendingUp className="w-4 h-4" />
                            </a>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                                Draws: Wed, Sat, Sun at 6:30 PM
                            </p>
                        </div>
                    </div>

                    {/* Singapore Sweep Prize */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5" />
                                <h2 className="text-lg font-bold">Sweep Grand Prize</h2>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                $2.3M
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                Per ticket (fixed)
                            </p>
                            <a
                                href="/sweep"
                                className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:underline text-sm font-medium"
                            >
                                View Sweep Results
                                <TrendingUp className="w-4 h-4" />
                            </a>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                                Draw: 1st Wednesday of each month
                            </p>
                        </div>
                    </div>

                    {/* Draw Schedule Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <h2 className="text-lg font-bold">Draw Schedule</h2>
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                Never miss a draw! Check the complete schedule for all Singapore lottery games.
                            </p>
                            <a
                                href="/schedule"
                                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
                            >
                                View Full Schedule
                                <TrendingUp className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* How Jackpots Work Section */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Info className="w-6 h-6 text-blue-500" />
                        How TOTO Jackpots Work
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm">
                            <p>
                                <strong className="text-gray-900 dark:text-white">The Snowball Effect:</strong> TOTO uses a pari-mutuel system where 54% of sales go to the prize pool. If no one matches all 6 numbers (Group 1), the prize &quot;snowballs&quot; to the next draw. This can continue for multiple draws, creating massive jackpots.
                            </p>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Cascade Draws:</strong> When the jackpot snowballs for 4 consecutive draws without a Group 1 winner, a special &quot;Cascade Draw&quot; is held at 9:30 PM. If there is still no winner, the prize cascades down to Group 2 winners.
                            </p>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Minimum Jackpot:</strong> The minimum guaranteed Group 1 prize is $1,000,000. Even if sales are low, Singapore Pools guarantees this minimum.
                            </p>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Shared Prizes:</strong> If multiple players win Group 1, the prize is split equally among all winners.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Prize Tiers Section */}
                <section className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-green-500" />
                        Understanding Prize Tiers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">TOTO (7 Groups)</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>Group 1: 6 numbers (Jackpot)</li>
                                <li>Group 2: 5 + additional</li>
                                <li>Group 3: 5 numbers</li>
                                <li>Group 4: 4 + additional</li>
                                <li>Group 5-7: 4/3 numbers</li>
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-yellow-600 dark:text-yellow-400 mb-2">4D (23 Prizes)</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>1st Prize: $2,000 per $1</li>
                                <li>2nd Prize: $1,000 per $1</li>
                                <li>3rd Prize: $490 per $1</li>
                                <li>Starter: $250 per $1</li>
                                <li>Consolation: $60 per $1</li>
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-green-600 dark:text-green-400 mb-2">Singapore Sweep</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>1st Prize: $2,300,000</li>
                                <li>2nd Prize: $500,000</li>
                                <li>3rd Prize: $250,000</li>
                                <li>Jackpot: $1,000,000</li>
                                <li>2D Prizes: $6 each</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-purple-500" />
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What is the biggest jackpot in {currentYear}?</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {largestJackpotThisYear > 0 ? (
                                    <>The largest TOTO Group 1 prize in {currentYear} so far is <strong className="text-gray-900 dark:text-white">{formatCurrency(largestJackpotThisYear)}</strong>
                                        {largestJackpotDate && ` from the draw on ${new Date(largestJackpotDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}`}.
                                        Jackpots can grow this large when there are no Group 1 winners for several consecutive draws.</>
                                ) : (
                                    <>We just started tracking results in {currentYear}. The largest TOTO jackpot will be displayed here once we have draw data. Jackpots can reach millions when they snowball across multiple draws.</>
                                )}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Are lottery winnings taxed in Singapore?</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                No! Singapore does not tax lottery winnings. Whatever you win is yours to keep in full. This applies to all Singapore Pools games including TOTO, 4D, and Singapore Sweep.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How long do I have to claim my prize?</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                You have 180 days from the draw date to claim your prize. Prizes up to $5,000 can be claimed at any Singapore Pools outlet. Larger prizes must be claimed at the main branch.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Responsible Gaming */}
                <section className="mt-8">
                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <span className="text-amber-500">⚠️</span> Play Responsibly
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                            Lottery games should be treated as entertainment, not as a way to make money. Set a budget you can afford to lose and stick to it. If gambling becomes a problem, seek help.
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
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
