import { SweepModel } from "@/lib/types";

export function SweepResult({ data }: { data: SweepModel }) {
    if (!data) return null;
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Singapore Sweep</h2>
                <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Draw No: {data.drawNo}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(data.drawDate).toLocaleDateString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">1st Prize</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.winning[0]}</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">2nd Prize</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.winning[1]}</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">3rd Prize</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.winning[2]}</div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Jackpot Prizes</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.jackpot.map((num, i) => (
                            <span key={i} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-mono">
                                {num}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Only showing key prizes for brevity, can expand if needed */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Lucky Prizes</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.lucky.map((num, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-mono">
                                {num}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
