import { SweepModel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Hash, Trophy, Star, Gift, Sparkles } from "lucide-react";
import { ReactNode } from "react";

function SweepBalls({ number }: { number: number | string }) {
    const numStr = number.toString().padStart(7, '0');
    if (numStr.length !== 7) return <div className="text-2xl font-bold">{number}</div>;

    const parts = [
        numStr.substring(0, 2),
        numStr[2],
        numStr[3],
        numStr[4],
        numStr[5],
        numStr[6]
    ];

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap justify-center gap-2">
                {parts.map((part, i) => (
                    <div key={i} className={`
                        flex items-center justify-center rounded-full font-bold shadow-lg border-4
                        ${i === 0
                            ? 'w-12 h-12 sm:w-14 sm:h-14 bg-yellow-500 text-white border-yellow-400 text-lg sm:text-xl'
                            : 'w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 text-white border-blue-400 text-xl sm:text-2xl'}
                    `}>
                        {part}
                    </div>
                ))}
            </div>
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-widest font-mono mt-1">
                {numStr}
            </div>
        </div>
    );
}

export function SweepResult({ data, countdown }: { data: SweepModel; countdown?: ReactNode }) {
    if (!data) return null;
    return (
        <div className="bg-white dark:bg-gray-800 shadow-xl overflow-hidden transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Singapore Sweep</h2>
                    </div>
                    <div className="text-right text-white/90">
                        <div className="flex items-center justify-end gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">{new Date(data.drawDate).toLocaleDateString('en-SG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Countdown slot */}
            {countdown && (
                <div className="px-4 py-3 bg-green-50/50 dark:bg-gray-800">
                    {countdown}
                </div>
            )}

            <div className="p-6">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-900/50 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                        <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-4">1st Prize</div>
                        <SweepBalls number={data.winning[0]} />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Prize: {formatCurrency(2300000)}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-400"></div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">2nd Prize</div>
                        <SweepBalls number={data.winning[1]} />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Prize: {formatCurrency(500000)}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">3rd Prize</div>
                        <SweepBalls number={data.winning[2]} />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Prize: {formatCurrency(250000)}</div>
                    </div>
                </div>

                {/* Stacked card layout - same for mobile and desktop */}
                <div className="space-y-4">
                    {/* Jackpot Prizes */}
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-yellow-800 dark:text-yellow-300">Jackpot Prizes</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.jackpot.map((num, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg text-center font-mono font-bold text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 shadow-sm">
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lucky Prizes */}
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                                <Star className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-purple-800 dark:text-purple-300">Lucky Prizes</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.lucky.map((num, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg text-center font-mono font-bold text-xs sm:text-sm text-purple-700 dark:text-purple-300 shadow-sm">
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gift Prizes */}
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center">
                                <Gift className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-pink-800 dark:text-pink-300">Gift Prizes</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.gift.map((num, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg text-center font-mono font-bold text-xs sm:text-sm text-pink-700 dark:text-pink-300 shadow-sm">
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
