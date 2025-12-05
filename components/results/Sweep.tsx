import { SweepModel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Hash, Trophy, Star, Gift, Sparkles } from "lucide-react";

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
        <div className="flex flex-col items-center gap-1">
            <div className="flex flex-wrap justify-center gap-2">
                {parts.map((part, i) => (
                    <div key={i} className={`
                        flex items-center justify-center
                        w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold shadow-md border-2
                        ${i === 0
                            ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-green-500 text-sm sm:text-base'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 text-lg sm:text-xl'}
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

export function SweepResult({ data }: { data: SweepModel }) {
    if (!data) return null;
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Singapore Sweep</h2>
                    </div>
                    <div className="text-right text-green-100 text-sm">
                        <div className="flex items-center justify-end gap-1">
                            <Hash className="w-3 h-3" />
                            <span>Draw {data.drawNo}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(data.drawDate).toLocaleDateString('en-SG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
            </div>

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

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <h3 className="font-semibold text-sm uppercase tracking-wide">Jackpot Prizes</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.jackpot.map((num, i) => (
                                <span key={i} className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm font-mono font-bold border border-yellow-100 dark:border-yellow-900/30">
                                    {num}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300">
                            <Star className="w-4 h-4 text-purple-500" />
                            <h3 className="font-semibold text-sm uppercase tracking-wide">Lucky Prizes</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.lucky.map((num, i) => (
                                <span key={i} className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-mono font-bold border border-purple-100 dark:border-purple-900/30">
                                    {num}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300">
                            <Gift className="w-4 h-4 text-pink-500" />
                            <h3 className="font-semibold text-sm uppercase tracking-wide">Gift Prizes</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.gift.map((num, i) => (
                                <span key={i} className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-lg text-sm font-mono font-bold border border-pink-100 dark:border-pink-900/30">
                                    {num}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
