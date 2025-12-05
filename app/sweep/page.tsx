import { SweepResult } from "@/components/results/Sweep";
import pool from "@/lib/db";
import { SweepModel } from "@/lib/types";
import { getStats, Timeframe } from "@/lib/stats";
import { BarChart3, Flame, Snowflake } from "lucide-react";

async function getLatestResult() {
    const [rows]: any = await pool.query('SELECT data FROM results WHERE type = "Sweep" ORDER BY draw_date DESC LIMIT 1');
    if (rows.length === 0) return null;
    return JSON.parse(rows[0].data) as SweepModel;
}

async function getRecentResults() {
    const [rows]: any = await pool.query('SELECT data FROM results WHERE type = "Sweep" ORDER BY draw_date DESC LIMIT 5');
    return rows.map((row: any) => JSON.parse(row.data) as SweepModel);
}

function HorizontalBarChart({ data, maxCount, title }: { data: any[], maxCount: number, title: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center gap-2 mb-6 text-gray-700 dark:text-gray-300">
                <BarChart3 className="w-5 h-5" />
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {data.map((item: any) => {
                    const width = (item.count / maxCount) * 100;
                    return (
                        <div key={item.number} className="flex items-center gap-4 group">
                            <div className="w-8 text-right text-sm font-mono font-bold text-gray-500 dark:text-gray-400">{item.number}</div>
                            <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all duration-500 ease-out group-hover:bg-blue-400 dark:group-hover:bg-blue-500"
                                    style={{ width: `${width}%` }}
                                ></div>
                            </div>
                            <div className="w-8 text-left text-xs font-bold text-gray-400 dark:text-gray-500">{item.count}x</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default async function SweepPage({ searchParams }: { searchParams: Promise<{ timeframe?: string }> }) {
    const { timeframe: timeframeParam } = await searchParams;
    const timeframe = (timeframeParam as Timeframe) || '30days';

    const latest = await getLatestResult();
    const recent = await getRecentResults();
    const stats = await getStats('Sweep', timeframe);

    if (!latest) return <div className="p-8 text-center">No data available.</div>;

    const firstDigitChart = (stats as any).firstDigitChart;
    const otherDigitChart = (stats as any).otherDigitChart;
    const maxCountFirst = Math.max(...firstDigitChart.map((d: any) => d.count), 1);
    const maxCountOther = Math.max(...otherDigitChart.map((d: any) => d.count), 1);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Latest Result */}
                <section>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <span className="w-4 h-4 rounded-full bg-green-500"></span>
                        Singapore Sweep
                    </h1>
                    <SweepResult data={latest} />
                </section>

                {/* Recent Results Table */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Results</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Draw Date</th>
                                    <th className="px-6 py-4">Draw No</th>
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
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{res.drawNo}</td>
                                        <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">{res.winning[0]}</td>
                                        <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">{res.winning[1]}</td>
                                        <td className="px-6 py-4 font-bold text-orange-600 dark:text-orange-400">{res.winning[2]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Statistics */}
                <section>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Statistics</h2>
                        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                            {['30days', '3months', '6months', '1year'].map((tf) => (
                                <a
                                    key={tf}
                                    href={`/sweep?timeframe=${tf}`}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeframe === tf
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {tf.replace('days', ' Days').replace('months', ' Months').replace('year', ' Year')}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Hot/Cold First Digits (10-44) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-2 mb-6 text-red-500">
                                <Flame className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Hot First Digits (10-44)</h3>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                                {(stats as any).hotFirst.map((item: any, i: number) => (
                                    <div key={i} className="text-center">
                                        <div className="w-10 h-10 mx-auto rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold shadow-md border-2 border-yellow-400 mb-2">
                                            {item.number}
                                        </div>
                                        <div className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 py-1 px-2 rounded-full inline-block">
                                            {item.count}x
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-2 mb-6 text-blue-500">
                                <Snowflake className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Cold First Digits (10-44)</h3>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                                {(stats as any).coldFirst.map((item: any, i: number) => (
                                    <div key={i} className="text-center">
                                        <div className="w-10 h-10 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-sm font-bold shadow-inner mb-2">
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

                    {/* Hot/Cold Other Digits (0-9) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-2 mb-6 text-red-500">
                                <Flame className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Hot Digits (0-9)</h3>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                                {(stats as any).hotOther.map((item: any, i: number) => (
                                    <div key={i} className="text-center">
                                        <div className="w-10 h-10 mx-auto rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold shadow-md border-2 border-blue-400 mb-2">
                                            {item.number}
                                        </div>
                                        <div className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 py-1 px-2 rounded-full inline-block">
                                            {item.count}x
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-2 mb-6 text-blue-500">
                                <Snowflake className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Cold Digits (0-9)</h3>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                                {(stats as any).coldOther.map((item: any, i: number) => (
                                    <div key={i} className="text-center">
                                        <div className="w-10 h-10 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-lg font-bold shadow-inner mb-2">
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

                    {/* Charts */}
                    <HorizontalBarChart data={firstDigitChart} maxCount={maxCountFirst} title="First Two Digits Frequency (10-44)" />
                    <HorizontalBarChart data={otherDigitChart} maxCount={maxCountOther} title="Other Digits Frequency (0-9)" />

                </section>
            </div>
        </main>
    );
}
