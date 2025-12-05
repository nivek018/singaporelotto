import { FourDModel } from "@/lib/types";

export function FourDResult({ data }: { data: FourDModel }) {
    if (!data) return null;
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">4D Results</h2>
                <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Draw No: {data.drawNo}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(data.drawDate).toLocaleDateString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">1st Prize</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.winning[0]}</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">2nd Prize</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.winning[1]}</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">3rd Prize</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.winning[2]}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Starter Prizes</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {data.starter.map((num, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-700/30 p-2 text-center rounded font-mono text-gray-800 dark:text-gray-200">
                                {num}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Consolation Prizes</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {data.consolation.map((num, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-700/30 p-2 text-center rounded font-mono text-gray-800 dark:text-gray-200">
                                {num}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
