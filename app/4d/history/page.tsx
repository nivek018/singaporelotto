import { constructMetadata } from "@/lib/metadata";
import pool from "@/lib/db";
import { FourDModel } from "@/lib/types";
import { ChevronLeft, ChevronRight, Search, Eye } from "lucide-react";
import { DateInput } from "@/components/ui/DateInput";
import { PastDrawResults } from "@/components/PastDrawResults";
import { ResponsiveAd } from "@/components/ads/AdSense";

export const metadata = constructMetadata({
    title: "4D Results History - SG Lotto",
    description: "Browse past 4D results with date range search",
    path: "/4d/history",
});

async function getHistory(page: number = 1, limit: number = 20, fromDate?: string, toDate?: string) {
    const offset = (page - 1) * limit;
    try {
        let query = 'SELECT data, draw_date FROM results WHERE type = "4D"';
        const params: any[] = [];

        if (fromDate) {
            query += ' AND draw_date >= ?';
            params.push(fromDate);
        }
        if (toDate) {
            query += ' AND draw_date <= ?';
            params.push(toDate);
        }

        query += ' ORDER BY draw_date DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows]: any = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as count FROM results WHERE type = "4D"';
        const countParams: any[] = [];
        if (fromDate) {
            countQuery += ' AND draw_date >= ?';
            countParams.push(fromDate);
        }
        if (toDate) {
            countQuery += ' AND draw_date <= ?';
            countParams.push(toDate);
        }
        const [countRows]: any = await pool.query(countQuery, countParams);
        const total = countRows[0].count;

        const results = rows.map((row: any) => {
            let data = row.data;
            if (typeof data === 'string') {
                try { data = JSON.parse(data); } catch (e) { return null; }
            }
            return {
                ...data,
                drawDate: typeof row.draw_date === 'string'
                    ? row.draw_date.split('T')[0]
                    : new Date(row.draw_date).toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' }),
            } as FourDModel;
        }).filter(Boolean);

        return { results, total, totalPages: Math.ceil(total / limit) };
    } catch (e) {
        console.error('Error fetching history:', e);
        return { results: [], total: 0, totalPages: 0 };
    }
}

interface SearchParams {
    page?: string;
    from?: string;
    to?: string;
}

export default async function FourDHistoryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const { page: pageParam, from, to } = await searchParams;
    const page = Number(pageParam) || 1;
    const { results, totalPages, total } = await getHistory(page, 20, from, to);

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        4D Results History
                    </h1>
                    <p className="text-lg text-blue-100 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        4D RESULTS HISTORY – Explore the complete archive of past Singapore <a href="/4d" className="text-white underline hover:text-yellow-300">4D results</a>. Browse winning numbers from previous years to analyze trends or check old tickets. Also view <a href="/toto/history" className="text-white underline hover:text-yellow-300">TOTO history</a> and <a href="/sweep/history" className="text-white underline hover:text-yellow-300">Sweep history</a>.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Ad below hero */}
                <div className="mb-6">
                    <ResponsiveAd />
                </div>

                {/* Date Range Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
                        <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4">
                            <DateInput name="from" label="From Date" defaultValue={from} />
                            <DateInput name="to" label="To Date" defaultValue={to} />
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            <button
                                type="submit"
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                                <Search className="w-4 h-4" />
                                Search
                            </button>
                            {(from || to) && (
                                <a
                                    href="/4d/history"
                                    className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center text-sm font-medium"
                                >
                                    Clear
                                </a>
                            )}
                        </div>
                    </form>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Showing {results.length} of {total} results
                    {(from || to) && <span> (filtered)</span>}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-4 py-4">Draw Date</th>
                                    <th className="px-4 py-4 text-center">1st Prize</th>
                                    <th className="px-4 py-4 text-center">2nd Prize</th>
                                    <th className="px-4 py-4 text-center">3rd Prize</th>
                                    <th className="px-4 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {results.map((result: FourDModel) => {
                                    const dateStr = result.drawDate.split('T')[0];
                                    return (
                                        <tr key={result.drawNo} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                {new Date(result.drawDate).toLocaleDateString('en-SG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg font-mono font-bold text-lg">
                                                    {result.winning[0]?.toString().padStart(4, '0')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-mono font-bold">
                                                    {result.winning[1]?.toString().padStart(4, '0')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg font-mono font-bold">
                                                    {result.winning[2]?.toString().padStart(4, '0')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <a
                                                    href={`/4d/${dateStr}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View Details
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {results.map((result: FourDModel) => {
                        const dateStr = result.drawDate.split('T')[0];
                        return (
                            <div key={result.drawNo} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {new Date(result.drawDate).toLocaleDateString('en-SG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                    <a
                                        href={`/4d/${dateStr}`}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium"
                                    >
                                        <Eye className="w-3 h-3" />
                                        View
                                    </a>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">1st</div>
                                        <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded font-mono font-bold text-sm">
                                            {result.winning[0]?.toString().padStart(4, '0')}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">2nd</div>
                                        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-mono font-bold text-sm">
                                            {result.winning[1]?.toString().padStart(4, '0')}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">3rd</div>
                                        <span className="inline-block px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded font-mono font-bold text-sm">
                                            {result.winning[2]?.toString().padStart(4, '0')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {results.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl">
                        No results found for the selected date range.
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        {page > 1 && (
                            <a
                                href={`/4d/history?page=${page - 1}${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </a>
                        )}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Page {page} of {totalPages}
                        </span>
                        {page < totalPages && (
                            <a
                                href={`/4d/history?page=${page + 1}${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                )}

                {/* About This Archive Section */}
                <section className="mt-12 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About the 4D Results Archive</h2>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                            <p>
                                Browse recent Singapore 4D draw results in this archive. Use the date filter above to search for specific draws or navigate through past results using pagination. This archive grows with every new draw.
                            </p>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Draw Schedule:</strong> Singapore 4D draws are held every Wednesday, Saturday, and Sunday at 6:30 PM SGT. Special draws may occur on public holidays.
                            </p>
                            <p>
                                <strong className="text-gray-900 dark:text-white">Ticket Validity:</strong> Remember that winning 4D tickets are valid for 180 days from the draw date. Use this archive to verify old tickets before the expiry date.
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <span className="text-amber-500">💡</span> Tips for Using Historical Data
                        </h3>
                        <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-2">
                            <li>• <strong>Pattern Analysis:</strong> Some players study past results to identify frequently drawn digits or number patterns.</li>
                            <li>• <strong>Verify Old Tickets:</strong> Check if your old tickets have won by searching the draw date in the archive.</li>
                            <li>• <strong>Claim Reminders:</strong> If you find a winning ticket in the archive, claim it before the 180-day validity period expires.</li>
                        </ul>
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-3">
                            Disclaimer: Each 4D draw is an independent random event. Historical data does not predict future results.
                        </p>
                    </div>
                </section>
            </div>

            {/* Ad above Past Draw Results */}
            <div className="max-w-6xl mx-auto px-4 pb-6">
                <ResponsiveAd />
            </div>

            {/* Past Draw Results */}
            <PastDrawResults />
        </main>
    );
}
