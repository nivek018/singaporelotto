import { TotoModel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Hash, Trophy, Users, DollarSign } from "lucide-react";
import { ReactNode } from "react";

export function TotoResult({ data, countdown }: { data: TotoModel; countdown?: ReactNode }) {
    if (!data) return null;
    return (
        <div className="bg-white dark:bg-gray-800 shadow-xl overflow-hidden transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Toto Results</h2>
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
                <div className="px-4 py-3 bg-blue-50/50 dark:bg-gray-800">
                    {countdown}
                </div>
            )}

            <div className="p-6">
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {data.winning.map((num, i) => (
                        <div key={i} className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-blue-400">
                            {num}
                        </div>
                    ))}
                    <div className="flex items-center justify-center px-2 text-gray-400 font-bold">+</div>
                    <div className="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-yellow-400 relative group cursor-help">
                        {data.additional}
                        <span className="absolute -bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Additional Number</span>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Group</th>
                                <th className="px-6 py-3 text-right">Prize Amount</th>
                                <th className="px-6 py-3 text-right">Winners</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.winningShares.map((share, i) => (
                                <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <Trophy className={`w-4 h-4 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-gray-300'}`} />
                                        {share.group}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-gray-900 dark:text-gray-200">
                                        {formatCurrency(share.prizeAmount)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Users className="w-3 h-3 text-gray-400" />
                                            {share.count.toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
