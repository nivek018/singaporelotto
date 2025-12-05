import { FourDModel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Hash, Trophy, Award } from "lucide-react";

export function FourDResult({ data }: { data: FourDModel }) {
    if (!data) return null;
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-white">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-6 h-6" />
                        <h2 className="text-xl font-bold">4D Results</h2>
                    </div>
                    <div className="text-right text-yellow-100 text-sm">
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
                {/* Top 3 Prizes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/50 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                        <div className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider mb-2">1st Prize</div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white tracking-widest mb-1 group-hover:scale-110 transition-transform">{data.winning[0]}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Prize: {formatCurrency(3000)}</div> {/* Approx prize for big bet, adjust if needed */}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-400"></div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">2nd Prize</div>
                        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-widest mb-1">{data.winning[1]}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Prize: {formatCurrency(1000)}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">3rd Prize</div>
                        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-widest mb-1">{data.winning[2]}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Prize: {formatCurrency(490)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Starter Prizes */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300">
                            <Award className="w-4 h-4 text-blue-500" />
                            <h3 className="font-semibold text-sm uppercase tracking-wide">Starter Prizes</h3>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {data.starter.map((num, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-gray-700/30 p-2 text-center rounded-lg font-mono font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Consolation Prizes */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300">
                            <Award className="w-4 h-4 text-green-500" />
                            <h3 className="font-semibold text-sm uppercase tracking-wide">Consolation Prizes</h3>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {data.consolation.map((num, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-gray-700/30 p-2 text-center rounded-lg font-mono font-bold text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
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
