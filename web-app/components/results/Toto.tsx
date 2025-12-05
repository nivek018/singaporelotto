import { TotoModel } from "@/lib/types";

export function TotoResult({ data }: { data: TotoModel }) {
    if (!data) return null;
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Toto Results</h2>
                <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Draw No: {data.drawNo}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(data.drawDate).toLocaleDateString()}</div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {data.winning.map((num, i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
                        {num}
                    </div>
                ))}
                <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl font-bold shadow-md relative">
                    {data.additional}
                    <span className="absolute -bottom-6 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Add. No</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Group</th>
                            <th className="px-6 py-3">Prize Amount</th>
                            <th className="px-6 py-3">Winners</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.winningShares.map((share, i) => (
                            <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{share.group}</td>
                                <td className="px-6 py-4">${share.prizeAmount.toLocaleString()}</td>
                                <td className="px-6 py-4">{share.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
