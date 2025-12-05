import { SweepResult } from "@/components/results/Sweep";
import pool from "@/lib/db";
import { SweepModel } from "@/lib/types";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

async function getHistory(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    try {
        const [rows]: any = await pool.query(
            'SELECT data FROM results WHERE type = "Sweep" ORDER BY draw_date DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );

        const [countRows]: any = await pool.query('SELECT COUNT(*) as count FROM results WHERE type = "Sweep"');
        const total = countRows[0].count;

        const results = rows.map((row: any) => {
            let data = row.data;
            if (typeof data === 'string') {
                try { data = JSON.parse(data); } catch (e) { return null; }
            }
            return data as SweepModel;
        }).filter(Boolean);

        return { results, total, totalPages: Math.ceil(total / limit) };
    } catch (e) {
        return { results: [], total: 0, totalPages: 0 };
    }
}

export default async function SweepHistoryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;
    const { results, totalPages } = await getHistory(page);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6 text-gray-500 dark:text-gray-400 text-sm">
                    <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
                    <span>/</span>
                    <a href="/sweep/today" className="hover:text-blue-600 dark:hover:text-blue-400">Sweep</a>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">History</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        Sweep Results History
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Past winning numbers archive</p>
                </div>

                <div className="space-y-8">
                    {results.map((result: SweepModel) => (
                        <SweepResult key={result.drawNo} data={result} />
                    ))}
                </div>

                {results.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No history found.
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                        {page > 1 && (
                            <a href={`/sweep/history?page=${page - 1}`} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </a>
                        )}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Page {page} of {totalPages}
                        </span>
                        {page < totalPages && (
                            <a href={`/sweep/history?page=${page + 1}`} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Next <ChevronRight className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
