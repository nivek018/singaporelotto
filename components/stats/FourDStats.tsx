'use client';

import { useState, useTransition } from "react";
import { fetchStats } from "@/app/actions";
import { Timeframe } from "@/lib/stats";
import { FrequencyChart } from "./FrequencyChart";
import { Flame, Snowflake } from "lucide-react";

export function FourDStats({ initialStats }: { initialStats: any }) {
    const [stats, setStats] = useState(initialStats);
    const [timeframe, setTimeframe] = useState<Timeframe>('30days');
    const [isPending, startTransition] = useTransition();

    const handleTimeframeChange = (tf: Timeframe) => {
        setTimeframe(tf);
        startTransition(async () => {
            const newStats = await fetchStats('4D', tf);
            setStats(newStats);
        });
    };

    // Prepare chart data from hot/cold or re-calculate full frequency if needed.
    // Since getStats only returns hot/cold for 4D, we might need to update getStats to return full counts for the chart.
    // For now, I'll assume we want to chart the numbers we have or I should have updated getStats to return all counts.
    // Wait, the user asked for "frequency of its numbers chart" for 4D.
    // I need to update getStats to return the full frequency list for 4D too.

    // Let's assume I'll update getStats to return `frequency` array for 4D.
    // I will do a quick patch to `lib/stats.ts` after this to ensure `frequency` is returned.
    const frequency = stats.frequency || [];
    const maxCount = Math.max(...frequency.map((d: any) => d.count), 1);

    return (
        <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Statistics</h2>
                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                    {['30days', '3months', '6months', '1year'].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => handleTimeframeChange(tf as Timeframe)}
                            disabled={isPending}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeframe === tf
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {tf.replace('days', ' Days').replace('months', ' Months').replace('year', ' Year')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Hot Numbers */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6 text-red-500">
                        <Flame className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Hot Numbers (0-9)</h3>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        {stats.hot.map((item: any, i: number) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 mx-auto rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-md border-2 border-blue-400 mb-2">
                                    {item.number}
                                </div>
                                <div className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 py-1 px-2 rounded-full inline-block">
                                    {item.count}x
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cold Numbers */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6 text-blue-500">
                        <Snowflake className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Cold Numbers (0-9)</h3>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        {stats.cold.map((item: any, i: number) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-xl font-bold shadow-inner mb-2">
                                    {item.number}
                                </div>
                                <div className="text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 py-1 px-2 rounded-full inline-block">
                                    {item.count}x
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Frequency Chart */}
            {frequency.length > 0 && (
                <FrequencyChart
                    data={frequency}
                    maxCount={maxCount}
                    title="Digit Frequency (0-9)"
                    color="bg-blue-500"
                />
            )}
        </section>
    );
}
