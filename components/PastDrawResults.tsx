import pool from "@/lib/db";
import Link from "next/link";

interface DrawDate {
    date: string;
    games: { type: string; url: string }[];
}

async function getRecentDrawDates(limit: number = 10): Promise<DrawDate[]> {
    // Get recent unique draw dates with their game types
    // Use DATE_FORMAT to get YYYY-MM-DD string directly from MySQL to avoid timezone issues
    const [rows]: any = await pool.query(`
        SELECT DISTINCT DATE_FORMAT(draw_date, '%Y-%m-%d') as draw_date, type 
        FROM results 
        ORDER BY draw_date DESC 
        LIMIT ?
    `, [limit * 3]); // Get more to ensure we have enough unique dates

    // Group by date
    const dateMap = new Map<string, { type: string; url: string }[]>();

    for (const row of rows) {
        // draw_date is already a YYYY-MM-DD string from MySQL
        const dateStr = row.draw_date;
        const type = row.type;
        const url = `/${type.toLowerCase()}/${dateStr}`;

        if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, []);
        }

        // Avoid duplicates
        const games = dateMap.get(dateStr)!;
        if (!games.some(g => g.type === type)) {
            games.push({ type, url });
        }
    }

    // Convert to array and limit
    const result: DrawDate[] = [];
    for (const [date, games] of dateMap) {
        result.push({ date, games });
        if (result.length >= limit) break;
    }

    return result;
}

export async function PastDrawResults() {
    const drawDates = await getRecentDrawDates(10);

    if (drawDates.length === 0) return null;

    return (
        <section className="bg-gray-50 dark:bg-gray-800/50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Past Draw Results
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {drawDates.map((item) => {
                        const date = new Date(item.date);
                        const day = date.getDate();
                        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                        const formattedDate = date.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        });

                        return (
                            <div
                                key={item.date}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex gap-4"
                            >
                                {/* Date Badge */}
                                <div className="flex-shrink-0 w-14 text-center">
                                    <div className="bg-red-500 text-white text-xs font-bold py-0.5 rounded-t">
                                        {month}
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 border border-t-0 border-gray-200 dark:border-gray-600 rounded-b py-1">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{day}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                                        Lotto Results {formattedDate}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Lotto Results for{' '}
                                        {item.games.map((game, idx) => (
                                            <span key={game.type}>
                                                <Link
                                                    href={game.url}
                                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    {game.type}
                                                </Link>
                                                {idx < item.games.length - 1 && ', '}
                                            </span>
                                        ))}
                                        {' '}drawn on {formattedDate}.
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
