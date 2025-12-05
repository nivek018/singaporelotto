import { FourDResult } from "@/components/results/FourD";
import pool from "@/lib/db";
import { FourDModel } from "@/lib/types";
import { getStats, Timeframe } from "@/lib/stats";
import { FourDStats } from "@/components/stats/FourDStats";

async function getLatestResult() {
    const [rows]: any = await pool.query('SELECT data FROM results WHERE type = "4D" ORDER BY draw_date DESC LIMIT 1');
    if (rows.length === 0) return null;
    return JSON.parse(rows[0].data) as FourDModel;
}

async function getRecentResults() {
    const [rows]: any = await pool.query('SELECT data FROM results WHERE type = "4D" ORDER BY draw_date DESC LIMIT 5');
    return rows.map((row: any) => JSON.parse(row.data) as FourDModel);
}

export default async function FourDPage({ searchParams }: { searchParams: Promise<{ timeframe?: string }> }) {
    const { timeframe: timeframeParam } = await searchParams;
    const timeframe = (timeframeParam as Timeframe) || '30days';

    const latest = await getLatestResult();
    const recent = await getRecentResults();
    const stats = await getStats('4D', timeframe);

    if (!latest) return <div className="p-8 text-center">No data available.</div>;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Latest Result */}
                <section>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
                        4D Results
                    </h1>
                    <FourDResult data={latest} />
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
                                        <td className="px-6 py-4 font-bold text-yellow-600 dark:text-yellow-400">{res.winning[0]}</td>
                                        <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">{res.winning[1]}</td>
                                        <td className="px-6 py-4 font-bold text-orange-600 dark:text-orange-400">{res.winning[2]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Statistics (Client Component) */}
                <FourDStats initialStats={stats} />
            </div>
        </main>
    );
}
