import { SweepModel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Hash, Trophy, Star, Gift, Sparkles } from "lucide-react";

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/50 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                        <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">1st Prize</div>
                        <div className="text-3xl font-black text-gray-900 dark:text-white tracking-widest mb-1 group-hover:scale-110 transition-transform">{data.winning[0]}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Prize: {formatCurrency(2300000)}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-400"></div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">2nd Prize</div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-widest mb-1">{data.winning[1]}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Prize: {formatCurrency(500000)}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">3rd Prize</div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-widest mb-1">{data.winning[2]}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Prize: {formatCurrency(250000)}</div>
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
