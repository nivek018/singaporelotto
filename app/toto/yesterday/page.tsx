import { TotoResult } from "@/components/results/Toto";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
    title: "Toto Results Yesterday - SG Lotto",
    description: "Previous Toto Results",
    path: "/toto/yesterday",
});
import pool from "@/lib/db";
import { TotoModel } from "@/lib/types";
import { Calendar } from "lucide-react";

async function getResult(dateStr: string) {
    try {
        const [rows]: any = await pool.query(
            'SELECT data FROM results WHERE type = "Toto" AND draw_date = ? LIMIT 1',
            [dateStr]
        );
        if (rows.length > 0) {
            let data = rows[0].data;
            if (typeof data === 'string') {
                try { data = JSON.parse(data); } catch (e) { return null; }
            }
            return data as TotoModel;
        }
        return null;
    } catch (e) {
        return null;
    }
}

export default async function TotoYesterdayPage() {
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' });

    const data = await getResult(yesterday);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6 text-gray-500 dark:text-gray-400 text-sm">
                    <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
                    <span>/</span>
                    <a href="/toto" className="hover:text-blue-600 dark:hover:text-blue-400">Toto</a>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">Yesterday</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        Toto Results Yesterday
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {yesterdayDate.toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore', dateStyle: 'full' })}
                    </p>
                </div>

                {data ? (
                    <TotoResult data={data} />
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h3>
                        <p className="text-gray-500 dark:text-gray-400">There were no Toto draws yesterday.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
